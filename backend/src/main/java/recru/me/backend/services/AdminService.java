package recru.me.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import recru.me.backend.dto.JobResponseDTO;
import recru.me.backend.dto.RecruiterStatDTO;
import recru.me.backend.model.*;
import recru.me.backend.repository.*;
import recru.me.backend.util.CloudinaryUtil;
import recru.me.backend.util.EmailUtility;
import recru.me.backend.util.JwtUtil;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    @Value("${admin.secret}")
    private String adminSecret;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JobService jobService;
    @Autowired private JobRepository jobRepository;
    @Autowired private RecruiterRepository recruiterRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private EmailUtility emailUtility;
    @Autowired private ApplicationRepository applicationRepository;
    @Autowired private CompanyRepository companyRepository;
    @Autowired private CloudinaryUtil cloudinaryUtil;
    @Autowired private GrievanceRepo grievanceRepo;
    @Autowired private JobSkillRepository jobSkillRepository;

    public String adminLogin(String email, String password, String secret) {
        if (!email.equals(adminEmail) || !passwordEncoder.matches(password, adminPassword) || !secret.equals(adminSecret)) {
            throw new RuntimeException("Admin login failed");
        }
        return jwtUtil.generateToken(adminEmail, "ROLE_ADMIN");
    }

    public List<JobResponseDTO> getAllJobs() {
        List<Job> jobs = jobRepository.findAll();
        return jobs.stream()
                .map(job -> jobService.convertToDTO(job, null))
                .toList();
    }

    public String deleteJobPosting(Long jobId,String reason) {
        Job job = jobRepository.findById(jobId).orElse(null);
        if (job == null) {
            throw new RuntimeException("Job not found");
        }
        Recruiter recruiter = recruiterRepository.findById(job.getPostedBy()).orElse(null);
        String subject = "Job Deleted";
        assert recruiter != null;
        String text = "Dear " + recruiter.getName() + ", \n\n" +
                "Your job " + job.getTitle() + " has been deleted due to: " + reason + "\n\n" +
                "Best regards,\n" +
                "Recru.me";
        jobSkillRepository.deleteByJobId(jobId);
        jobRepository.delete(job);
        emailUtility.sendHtmlEmail(recruiter.getEmail(), subject, text);
        return "Job deleted successfully";
    }

    public String approveRecruiters(Long recruiterId) {
        Recruiter recruiter = recruiterRepository.findById(recruiterId).orElse(null);
        if (recruiter == null) {
            throw new RuntimeException("Recruiter not found");
        }
        recruiter.setVerified(true);
        recruiterRepository.save(recruiter);
        String subject = "Approved by RECRUME ADMIN";
        String text = "Dear " + recruiter.getName() + ", \n\n" +
                "Your account has been approved by the admin.\n\n" +
                "You can now login to your account and start job applications.\n\n" +
                "Best regards,\n" +
                "Recru.me";
        emailUtility.sendHtmlEmail(recruiter.getEmail(), subject, text);
        return "Recruiter approved successfully";
    }

    public String deleteRecruiter(Long recruiterId,String reason) {
        Recruiter recruiter = recruiterRepository.findById(recruiterId).orElse(null);
        if (recruiter == null) {
            throw new RuntimeException("Recruiter not found");
        }
        String subject = "Recruiter Deleted";
        String text = "Dear " + recruiter.getName() + ", \n\n" +
                "Your account has been deleted due to: " + reason + "\n\n" +
                "Best regards,\n" +
                "Recru.me";
        recruiterRepository.delete(recruiter);
        emailUtility.sendHtmlEmail(recruiter.getEmail(), subject, text);
        return "Recruiter deleted successfully";
    }

    public List<Recruiter> getAllRecruiters() {
        return recruiterRepository.findAll();
    }
    public List<Recruiter> getRecruitersToApprove(){
        return recruiterRepository.findUnVerifiedRecruiters();
    }

    public List<RecruiterStatDTO> getRecruiterStatistics() {
        List<Recruiter> recruiters = recruiterRepository.findAll();
        List<RecruiterStatDTO> statsList = new ArrayList<>();

        for (Recruiter recruiter : recruiters) {
            List<Job> jobs = jobRepository.findByPostedBy(recruiter.getId());
            List<Long> jobIds = jobs.stream()
                    .map(Job::getId)
                    .collect(Collectors.toList());

            List<Application> applications = applicationRepository.findByJobIdsNative(jobIds);

            int accepted = (int) applications.stream().filter(Application::isAccepted).count();
            int rejected = (int) applications.stream().filter(a -> !a.isAccepted()).count();

            statsList.add(new RecruiterStatDTO(
                    recruiter.getId(),
                    jobs.size(),
                    accepted,
                    rejected
            ));
        }

        return statsList;
    }

    public Company addCompany(String name, String description, MultipartFile logo) {
        Company company = new Company();
        company.setName(name);
        company.setDescription(description);
        String logoUrl = cloudinaryUtil.uploadFile(logo);
        company.setLogo(logoUrl);
        return companyRepository.save(company);
    }

    public String deleteCompany(Long companyId) {
        Company company = companyRepository.findById(companyId).orElse(null);
        if (company == null) {
            throw new RuntimeException("Company not found");
        }
        companyRepository.delete(company);
        return "Company deleted successfully";
    }

    public List<Company> getAllCompanies() {return companyRepository.findAll();}

    public List<GrievanceStore> getAllGrievances() {return grievanceRepo.findAllGrievances();}
    public String grievanceStatusUpdate(Long grievanceId) {
        GrievanceStore grievance = grievanceRepo.findById(grievanceId).orElse(null);
        if (grievance == null) {
            throw new RuntimeException("Grievance not found");
        }
        grievance.setStatus(true);
        grievanceRepo.save(grievance);
        return "Grievance status updated successfully";
    }
}
