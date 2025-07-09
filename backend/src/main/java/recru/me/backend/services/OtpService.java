package recru.me.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import recru.me.backend.model.Otp;
import recru.me.backend.repository.OtpRepository;

import java.util.Date;

@Service
public class OtpService {
    @Autowired
    private OtpRepository otpRepository;

    public void updateOtpByEmail(String email, int otp, Date expirationTime) {
        if(otpRepository.findByEmail(email) == null) {
            otpRepository.save(new Otp(email, otp, expirationTime));
        }
        else {
            otpRepository.updateOtpByEmail(email, otp, expirationTime);
        }
    }

    public boolean validateOtp(String email, int otp) {
        Otp existingOtp = otpRepository.findByEmail(email);
        if (existingOtp == null) {
            return false;
        }
        return existingOtp.getOtp() == otp && existingOtp.getExpirationTime().after(new Date());
    }

    public int generateOtp() {
        return 100000 + (int)(Math.random() * 900000);
    }
}
