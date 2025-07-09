package recru.me.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecruiterStatDTO {
    private Long recruiterId;
    private int totalJobsPosted;
    private int applicationsAccepted;
    private int applicationsRejected;
}

