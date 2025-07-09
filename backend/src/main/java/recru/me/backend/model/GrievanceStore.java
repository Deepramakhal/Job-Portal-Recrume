package recru.me.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Data @Table(name = "grievance_store") @AllArgsConstructor @NoArgsConstructor
@Getter @Setter @Entity
public class GrievanceStore {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String role;
    private String sender_name;
    private String sender_email;
    private String grievance;
    private boolean status;
}
