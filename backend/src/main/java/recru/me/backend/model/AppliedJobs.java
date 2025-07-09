package recru.me.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Table(name = "applied_jobs")
@AllArgsConstructor @NoArgsConstructor @Getter @Setter
public class AppliedJobs {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long user_id;
    private Long job_id;
}
