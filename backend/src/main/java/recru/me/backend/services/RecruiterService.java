package recru.me.backend.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import recru.me.backend.dto.JobResponseDTO;
import recru.me.backend.dto.NewJobDTO;
import recru.me.backend.model.*;
import recru.me.backend.repository.*;
import recru.me.backend.util.CloudinaryUtil;
import recru.me.backend.util.EmailUtility;
import recru.me.backend.util.FileStorageUtil;
import recru.me.backend.util.JwtUtil;

import java.util.Date;
import java.util.List;

@Service
public class RecruiterService {
    @Autowired private JwtUtil jwtUtil;
    @Autowired private RecruiterRepository recruiterRepository;
    @Autowired private JobService jobService;
    @Autowired private JobRepository jobRepository;
    @Autowired private UserService userService;
    @Autowired OtpService otpService;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private CompanyRepository companyRepository;
    @Autowired private EmailUtility emailUtility;
    @Autowired private CloudinaryUtil cloudinaryUtil;
    @Autowired private FileStorageUtil fileStorageUtil;
    @Autowired private JobSkillRepository jobSkillRepository;
    @Autowired private GrievanceRepo grievanceRepo;

    public NewJobDTO newJob(NewJobDTO newJobDTO, String token) throws JsonProcessingException {
        return jobService.createJobPosting(newJobDTO, token.startsWith("Bearer ") ? token.substring(7) : token);
    }

    public JobResponseDTO getJobDetails(String token, Long jobId){
        Recruiter recruiter = getLoggedInRecruiter(token.startsWith("Bearer ") ? token.substring(7) : token);
        if(recruiter == null) return null;
        Job job = jobRepository.findById(jobId).orElse(null);
        if(job == null) return null;
        if(!recruiter.getId().equals(job.getPostedBy())) return null;
        JobResponseDTO jobResponseDTO = new JobResponseDTO();
        jobResponseDTO.setId(job.getId());
        jobResponseDTO.setTitle(job.getTitle());
        jobResponseDTO.setDescription(job.getDescription());
        jobResponseDTO.setLocation(job.getLocation());
        jobResponseDTO.setWorkPlace(job.getWork_place());
        jobResponseDTO.setWorkMode(job.getWork_mode());
        jobResponseDTO.setExperience(job.getExperience());
        jobResponseDTO.setMinSalary(job.getMin_salary());
        jobResponseDTO.setMaxSalary(job.getMax_salary());
        jobResponseDTO.setCompanyName(job.getCompany());
        jobResponseDTO.setCompanyLogo(job.getCompanyLogo());
        jobResponseDTO.setPostedAt(job.getPosted_at());
        jobResponseDTO.setDeadline(job.getDeadline());
        jobResponseDTO.setSkills(jobService.getJobSkills(job.getId()));
        return jobResponseDTO;
    }
    @Transactional
    public String deleteJobPosting(String token, Long jobId, int Otp){
        Recruiter recruiter = getLoggedInRecruiter(token.startsWith("Bearer ") ? token.substring(7) : token);
        if(recruiter == null) return null;
        if(otpService.validateOtp(recruiter.getEmail(), Otp)){
            jobSkillRepository.deleteByJobId(jobId);
            jobRepository.deleteById(jobId);
        return "Job deleted successfully!";}
        return "Invalid OTP";
    }

    public Recruiter getLoggedInRecruiter(String token) {
        String email = jwtUtil.getEmailFromToken(token.startsWith("Bearer ") ? token.substring(7) : token,false);
        return recruiterRepository.findByEmail(email);
    }

    public String deleteAccount(String token,int otp) {
        Recruiter recruiter = getLoggedInRecruiter(token.startsWith("Bearer ") ? token.substring(7) : token);
        if(recruiter == null) return null;
        if(otpService.validateOtp(recruiter.getEmail(), otp)){;
        recruiterRepository.delete(recruiter);
        return "Account deleted successfully!";}
        return "Invalid OTP";
    }
    public String changePassword(String token, String oldPassword, String newPassword,int OTP){
        String email = jwtUtil.getEmailFromToken(token, false);
        Recruiter user = recruiterRepository.findByEmail(email);
        if (user == null){
            return "User not found";
        }
        if(!passwordEncoder.matches(oldPassword, user.getPassword())){
            return "Old password is incorrect";
        }
        if(!otpService.validateOtp(email, OTP)){
            return "Invalid OTP";
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        recruiterRepository.save(user);
        return "Password changed successfully";
    }

    public String editJobDeadline(String token, Long jobId, Date deadline) {
        Recruiter recruiter = getLoggedInRecruiter(token.startsWith("Bearer ") ? token.substring(7) : token);
        if(recruiter == null) return "Unauthenticated user";
        Job job = jobRepository.findById(jobId).orElse(null);
        if(job == null) return "Job not found";
        if(!recruiter.getId().equals(job.getPostedBy())) return "Unauthorized access";
        job.setDeadline(deadline);
        jobRepository.save(job);
        return "Deadline updated successfully";
    }

    public String updateCompany(String token, Long companyId){
        Recruiter recruiter = getLoggedInRecruiter(token.startsWith("Bearer ") ? token.substring(7) : token);
        if(recruiter == null) return "Unauthenticated user";
        Company company = companyRepository.findById(companyId).orElse(null);
        if(company == null) return "Company not found";
        recruiter.setCompany_id(company.getId());
        recruiter.setVerified(false);
        recruiterRepository.save(recruiter);
        String subject = "Company update by RECRUME ADMIN";
        String text = "Dear " + recruiter.getName() + ", \n\n" +
                "Your company has been updated by the admin.\n\n" +
                "Admin will verify your company details soon.\n\n" +
                "Then you can login to your account and start job applications.\n\n" +
                "Best regards,\n" +
                "Recrume";
        emailUtility.sendHtmlEmail(recruiter.getEmail(), subject, text);
        return "Company updated successfully";
    }
    public String updateProfileImage(String token, MultipartFile profileImage) {
        Recruiter recruiter = getLoggedInRecruiter(token.startsWith("Bearer ") ? token.substring(7) : token);
        if(recruiter == null) return "Unauthenticated user";
        String profileImageUrl = cloudinaryUtil.uploadFile(profileImage);
        recruiter.setProfile_image(profileImageUrl);
        recruiterRepository.save(recruiter);
        return "Profile image updated successfully";
    }

    public String updateDocuments(String token, MultipartFile documents) {
        Recruiter recruiter = getLoggedInRecruiter(token.startsWith("Bearer ") ? token.substring(7) : token);
        if(recruiter == null) return "Unauthenticated user";
        String documentUrl = fileStorageUtil.storeFile(documents);
        recruiter.setDocuments(documentUrl);
        recruiterRepository.save(recruiter);
        return "Documents updated successfully";
    }

    public String sendGrievance(String token, String grievanceMessg){
        Recruiter user = getLoggedInRecruiter(token.substring(7));
        GrievanceStore grievance = new GrievanceStore();
        grievance.setRole("RECRUITER");
        grievance.setSender_email(user.getEmail());
        grievance.setSender_name(user.getName());
        grievance.setGrievance(grievanceMessg);
        grievance.setStatus(false);
        grievanceRepo.save(grievance);
        return "Grievance sent successfully";
    }
    public List<Company> getAllCompany(){
        return  companyRepository.findAll();
    }
}
