package recru.me.backend.dto;

import lombok.Getter;
import lombok.Setter;
import recru.me.backend.model.Role;

@Getter @Setter

public class LoginDTO {
    private String email;
    private String password;
    private Role role;
}
