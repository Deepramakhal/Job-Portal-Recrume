package recru.me.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;


@Entity @Table(name = "application")
@Data @Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long job_id;
    private String name;
    private String email;
    private String lastQualification;
    private String experience;
    @Column(columnDefinition = "json")
    private String skills;
    private String resume;
    private String interview_link;
    private Date interview_date;
    private boolean isAccepted;
    private boolean status;
}