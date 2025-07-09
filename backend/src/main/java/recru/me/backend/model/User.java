package recru.me.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "user")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter @Setter
@ToString
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(unique = true)
    private String email;
    @JsonIgnore
    private String password;
    private String profile_image;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<UserSkill> userSkills = new HashSet<>();
    private String education;
    private String experience;
    private String resume;
    private boolean hasPremium;
    private String homeCity;
    @Enumerated(EnumType.STRING)
    private Role role;
}
