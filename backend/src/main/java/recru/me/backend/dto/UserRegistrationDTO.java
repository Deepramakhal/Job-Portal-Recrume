package recru.me.backend.dto;

import lombok.Getter;
import lombok.Setter;
import recru.me.backend.model.Role;

@Getter @Setter
public class UserRegistrationDTO {
    private String name;
    private String email;
    private String confirmPassword;
    private String password;
    private String education;
    private String experience;
    private String homeCity;
    private Role role;
}
