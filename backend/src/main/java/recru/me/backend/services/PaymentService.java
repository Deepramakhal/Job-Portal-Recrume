package recru.me.backend.services;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import recru.me.backend.model.User;
import recru.me.backend.repository.UserRepository;
import recru.me.backend.util.EmailUtility;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

import static com.razorpay.Utils.bytesToHex;

@Service
public class PaymentService {
    @Value("${razorpay.api.key}")
    private String apiKey;
    @Value("${razorpay.api.secret}")
    private String apiSecret;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private EmailUtility emailUtility;

    public String createOrder(int amount, String currency, String recipientId) throws RazorpayException {
        RazorpayClient razorpayClient = new RazorpayClient(apiKey, apiSecret);
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amount * 100);
        orderRequest.put("currency", currency);
        orderRequest.put("receipt", recipientId);

        Order order = razorpayClient.orders.create(orderRequest);

        return order.toString();
    }
    public String verifyOrder(String orderId, String paymentId, String razorpaySignature, String token) {
        try {
            System.out.println( "orderId: " + orderId + ", paymentId: " + paymentId + ", razorpaySignature: " + razorpaySignature);
            String payload = orderId + "|" + paymentId;
            String generatedSignature = hmacSHA256(payload, apiSecret);

            if (!generatedSignature.equals(razorpaySignature)) {
                return "Payment verification failed!";
            }

            User user = userService.getLoggedInUser(token.startsWith("Bearer ") ? token.substring(7) : token);
            if (user == null) return "User not found";

            user.setHasPremium(true);
            userRepository.save(user);

            System.out.println("Payload: " + payload);
            System.out.println("Expected Signature: " + generatedSignature);
            System.out.println("Received Signature: " + razorpaySignature);


            String subject = "Premium Subscription Activated";
            String body = "You have successfully subscribed to premium. We are happy to have you with us.";
            emailUtility.sendHtmlEmail(user.getEmail(), subject, body);

            return "Premium Subscription Activated";
        } catch (Exception e) {
            System.out.println("Error occurred during payment verification: " + e.getMessage());
            return "Verification failed due to server error.";
        }
    }
    private String hmacSHA256(String data, String key) throws Exception {
        Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
        SecretKeySpec secret_key = new SecretKeySpec(key.getBytes(), "HmacSHA256");
        sha256_HMAC.init(secret_key);
        byte[] hash = sha256_HMAC.doFinal(data.getBytes());
        return bytesToHex(hash);
    }
}
