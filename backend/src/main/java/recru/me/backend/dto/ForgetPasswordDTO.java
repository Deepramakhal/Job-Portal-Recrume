package recru.me.backend.dto;

import lombok.Getter;
import lombok.Setter;
import recru.me.backend.model.Role;

@Getter @Setter
public class ForgetPasswordDTO {
    private String email;
    private String password;
    private String confirmPassword;
    private int otp;
    private Role role;

    @Getter @Setter
    public static class sendOtpDTO{
        private String email;
        private Role role;
    }
}
