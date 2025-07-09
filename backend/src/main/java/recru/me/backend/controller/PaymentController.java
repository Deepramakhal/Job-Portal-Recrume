package recru.me.backend.controller;
import com.razorpay.RazorpayException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import recru.me.backend.dto.PaymentDTO;
import recru.me.backend.services.PaymentService;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {RequestMethod.POST})
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-payment")
    public String createOrder(@RequestBody PaymentDTO order) throws Exception {
        System.out.println(order);
        return paymentService.createOrder(order.getAmount(), order.getCurrency(), order.getRecipientId());
    }

    @PostMapping("/verify-payment")
    public String verifyOrder(
            @RequestBody Map<String, String> payload,
            @RequestHeader(value = "Authorization") String token) {
        return paymentService.verifyOrder(
                payload.get("razorpay_order_id"),
                payload.get("razorpay_payment_id"),
                payload.get("razorpay_signature"),
                token
        );
    }
}