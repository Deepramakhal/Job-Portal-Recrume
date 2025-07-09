package recru.me.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.util.Date;

@Entity
@Data
@Table(name = "otp")
@AllArgsConstructor @NoArgsConstructor @Getter @Setter
public class Otp {
    @Id
    @Column(unique = true)
    private String email;
    private int Otp;
    private Date expirationTime;
}
