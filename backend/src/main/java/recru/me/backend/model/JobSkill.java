package recru.me.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "job_skill")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class JobSkill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    @JsonIgnore
    private Job job;

    @ManyToOne
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    public JobSkill( Job job, Skill skill) {
        this.job = job;
        this.skill = skill;
    }
}