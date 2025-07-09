package recru.me.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Table(name = "company")
@AllArgsConstructor @NoArgsConstructor @Getter @Setter
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;
    private String logo;
    @Column(columnDefinition = "TEXT")
    private String description;
}
