package recru.me.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "recruiter")
@Data
@AllArgsConstructor @NoArgsConstructor @Getter @Setter
public class Recruiter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Column(unique = true)
    private String email;
    @JsonIgnore
    private String password;
    private String profile_image;
    private Long company_id;
    private boolean isVerified;
    private String documents;
    @Enumerated(EnumType.STRING)
    private Role role;
}
