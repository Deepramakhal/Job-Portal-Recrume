package recru.me.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class NewJobDTO {
    private String title;
    private String description;
    private String location;
    private String work_place;
    private String work_mode;
    private String experience;
    private int min_salary;
    private int max_salary;
    private Long companyId;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date deadline;
    private List<Long> skillIds;
}
