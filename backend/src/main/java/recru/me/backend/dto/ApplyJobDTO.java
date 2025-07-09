package recru.me.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class ApplyJobDTO {
    private Long jobId;
    private String name;
    private String email;
    private String lastQualification;
    private String experience;
    private List<String> skills;
}
