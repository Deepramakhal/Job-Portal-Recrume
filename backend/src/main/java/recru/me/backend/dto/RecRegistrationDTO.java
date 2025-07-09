package recru.me.backend.dto;

import lombok.Getter;
import lombok.Setter;
import recru.me.backend.model.Role;

@Getter @Setter
public class RecRegistrationDTO {
    private String name;
    private String email;
    private String password;
    private String confirmPassword;
    private Long company_id;
    private boolean isVerified = true;
    private Role role;
}
