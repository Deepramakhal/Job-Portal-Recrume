package recru.me.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Table(name = "saved_jobs")
@AllArgsConstructor @NoArgsConstructor @Getter @Setter
public class SavedJobs {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long user_id;
    private Long job_id;
}
