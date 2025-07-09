package recru.me.backend.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import recru.me.backend.model.Job;
import recru.me.backend.model.User;
import recru.me.backend.repository.JobRepository;
import recru.me.backend.repository.UserRepository;
import recru.me.backend.repository.UserSkillRepository;
import recru.me.backend.util.EmailUtility;

import java.util.List;

@Service
public class JobRecommendation {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserSkillRepository userSkillRepository;
    @Autowired
    JobRepository jobRepository;
    @Autowired
    private ApplicationService applicationService;
    @Autowired EmailUtility emailUtility;

    public void sendJobRecommendation(List<Long> jobSkillIds, Long jobId) throws JsonProcessingException {
        List<User> users = userRepository.getUsersForRecommendationService();
        Job job = jobRepository.findById(jobId).orElse(null);
        for (User user : users) {
            List<Long> userSkillIds = userSkillRepository.findSkillIdsByUserId(user.getId());
            long matchCount = userSkillIds.stream().filter(jobSkillIds::contains).count();

            if (matchCount >= 5) {
                String subject = "Job recommendation for you!"; // Replace with appropriate subject line
                String body = "Hi " + user.getName() + ",\n\n" +
                        "We recommend you to apply for this job:\n" +
                        "Job Title: " + job.getTitle() + "\n" +
                        "Job Description: " + job.getDescription() + "\n" +
                        "Apply now!\n\n" +
                        "Best regards,\n" +
                        "Recru.me"; // Replace with appropriate body content
                emailUtility.sendHtmlEmail(user.getEmail(), subject, body);
            }
        }
    }
}
