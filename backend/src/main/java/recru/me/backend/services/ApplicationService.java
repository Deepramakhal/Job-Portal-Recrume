package recru.me.backend.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import recru.me.backend.dto.ApplyJobDTO;
import recru.me.backend.model.Application;
import recru.me.backend.model.Job;
import recru.me.backend.model.User;
import recru.me.backend.repository.ApplicationRepository;
import recru.me.backend.repository.JobRepository;
import recru.me.backend.repository.UserRepository;
import recru.me.backend.repository.UserSkillRepository;
import recru.me.backend.util.EmailUtility;
import recru.me.backend.util.FileStorageUtil;
import recru.me.backend.util.JwtUtil;

import javax.swing.plaf.multi.MultiPanelUI;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ApplicationService {
    @Autowired private UserRepository userRepository;
    @Autowired private JobRepository jobRepository;
    @Autowired
    @Lazy
    private JobService jobService;
    @Autowired private UserSkillRepository userSkillRepository;
    @Autowired private ApplicationRepository applicationRepository;
    @Autowired private FileStorageUtil fileStorageUtil;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private EmailUtility emailUtil;

    public boolean quickApplyForJob(Long userId, Long jobId) throws JsonProcessingException {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null && jobRepository.existsById(jobId)) {
            Application application = new Application();
            application.setJob_id(jobId);
            application.setExperience(user.getExperience());
            application.setEmail(user.getEmail());
            application.setLastQualification(user.getEducation());
            application.setName(user.getName());
            application.setResume(user.getResume());
            application.setAccepted(false);
            application.setInterview_date(null);
            application.setInterview_link(null);
            ObjectMapper mapper = new ObjectMapper();
            String jsonSkills = mapper.writeValueAsString(userSkillRepository.findSkillNamesByUserId(user.getId()));
            application.setSkills(jsonSkills);
            applicationRepository.save(application);
            return true;
        }
        return false;
    }
    public boolean manualApplyForJob(ApplyJobDTO data, MultipartFile resume) {
        String skillsJson = "[]";
        try {
            ObjectMapper mapper = new ObjectMapper();
            skillsJson = mapper.writeValueAsString(data.getSkills());
        } catch (JsonProcessingException e) {
            return false;
        }
        String resumeUrl = fileStorageUtil.storeFile(resume);

        Application application = new Application();
        application.setJob_id(data.getJobId());
        application.setName(data.getName());
        application.setEmail(data.getEmail());
        application.setExperience(data.getExperience());
        application.setSkills(skillsJson); // ✅ JSON string like ["Java","Halalala"]
        application.setResume(resumeUrl);
        application.setLastQualification(data.getLastQualification());

        applicationRepository.save(application);
        return true;
    }


    public List<Application> getApplicationsByJobId(Long jobId) {
        return applicationRepository.findByJob_id(jobId);
    }

    public List<Application> getAppliedJobs(String token){
        User user = userRepository.findByEmail(jwtUtil.getEmailFromToken(token.substring(7),false));
        return applicationRepository.findByEmail(user.getEmail());
    }

    public void scheduleInterview(Long applicationId, Date interViewDate) {
        Application application = applicationRepository.findById(applicationId).orElse(null);
        String room = "interview" + UUID.randomUUID().toString().substring(16);
        String interviewLink = "https://meet.jit.si/" + room;

        assert application != null;
        application.setInterview_date(interViewDate);
        application.setInterview_link(interviewLink);

        // ✅ Format date & time correctly
        SimpleDateFormat date = new SimpleDateFormat("dd/MM/yyyy");
        SimpleDateFormat time = new SimpleDateFormat("HH:mm:ss");
        String interviewDate = date.format(interViewDate);
        String interviewTime = time.format(interViewDate);  // ✅ fixed this line

        String subject = "Interview Invitation";
        String body = "Dear Candidate,\n\n" +
                "Your interview is scheduled on " + interviewDate +
                " at " + interviewTime + ". Please join via the link: " + interviewLink;

        emailUtil.sendHtmlEmail(application.getEmail(), subject, body);
        applicationRepository.save(application);
    }

    public String applicationStatus(Long applicationId, String status){
        Application application = applicationRepository.findById(applicationId).orElse(null);
        assert application != null;
        if(status.equals("ACCEPTED")) {
            application.setAccepted(true);
            application.setStatus(true);
            applicationRepository.save(application);
            String subject = "🎉 Congratulations! Your Application Has Been Accepted - Recru.me";
            String body = "Dear Candidate,<br><br>" +
                    "We are excited to inform you that your application has been <strong>accepted</strong>!<br>" +
                    "The hiring team was impressed with your profile.<br><br>" +
                    "You will be contacted shortly with further steps.<br><br>" +
                    "Best wishes,<br>Team Recru.me";
            emailUtil.sendHtmlEmail(application.getEmail(),subject,body);
            return "Application Accepted";
        };
        if(status.equals("REJECTED")) {application.setAccepted(false);
            application.setStatus(true);
            applicationRepository.save(application);
            String subject = "Update on Your Job Application - Recru.me";
            String body = "Dear Candidate,<br><br>" +
                    "Thank you for taking the time to apply.<br>" +
                    "After careful consideration, we regret to inform you that your application was <strong>not selected</strong> for this position.<br><br>" +
                    "We encourage you to continue exploring opportunities on <strong>Recru.me</strong> and wish you the best in your job search.<br><br>" +
                    "Sincerely,<br>Team Recru.me";
            emailUtil.sendHtmlEmail(application.getEmail(),subject,body);
            return "Application rejected";
        };
        return "Application Status update failed";
    }
    public List<Job> getJobsWithUpcomingInterviews() {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DAY_OF_MONTH, 10);
        Date futureDate = cal.getTime();

        List<Object[]> rows = applicationRepository.findJobIdsAndInterviewDates(futureDate);

        if (rows.isEmpty()) return Collections.emptyList();

        // Preserve order of earliest interview
        Map<Long, Date> jobIdToInterviewDate = new LinkedHashMap<>();
        for (Object[] row : rows) {
            Long jobId = ((Number) row[0]).longValue();
            Date interviewDate = (Date) row[1];
            jobIdToInterviewDate.putIfAbsent(jobId, interviewDate); // Keep only first (soonest) interview for that job
        }

        List<Job> jobs = jobRepository.findAllById(jobIdToInterviewDate.keySet());

        // Sort by earliest interview date
        jobs.sort(Comparator.comparing(job -> jobIdToInterviewDate.get(job.getId())));

        return jobs;
    }
    public List<Application> getAcceptedApplications(Long jobId){
        return applicationRepository.getAcceptedApplications(jobId);
    }

}
