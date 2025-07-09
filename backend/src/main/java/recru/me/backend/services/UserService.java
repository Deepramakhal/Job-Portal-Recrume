package recru.me.backend.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import recru.me.backend.dto.ApplyJobDTO;
import recru.me.backend.dto.FetchSkillDTO;
import recru.me.backend.dto.JobResponseDTO;
import recru.me.backend.model.*;
import recru.me.backend.repository.GrievanceRepo;
import recru.me.backend.repository.SkillRepository;
import recru.me.backend.repository.UserRepository;
import recru.me.backend.repository.UserSkillRepository;
import recru.me.backend.util.CloudinaryUtil;
import recru.me.backend.util.EmailUtility;
import recru.me.backend.util.FileStorageUtil;
import recru.me.backend.util.JwtUtil;

import java.util.List;

@Service
public class UserService {
    @Autowired private UserRepository userRepository;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private UserSkillRepository userSkillRepository;
    @Autowired private SkillRepository skillRepository;
    @Autowired private JobService jobService;
    @Autowired private ApplicationService applicationService;
    @Autowired private EmailUtility emailUtility;
    @Autowired private CloudinaryUtil cloudinaryUtil;
    @Autowired private FileStorageUtil fileStorageUtil;
    @Autowired private OtpService otpService;
    @Autowired private GrievanceRepo grievanceRepo;
    public String changePassword(String token, String oldPassword, String newPassword,int OTP){
        String email = jwtUtil.getEmailFromToken(token, false);
        User user = userRepository.findByEmail(email);
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
        userRepository.save(user);
        return "Password changed successfully";
    }
    public boolean addSkill(String token, List<Long> skillIds){
        User user = getLoggedInUser(token.startsWith("Bearer ") ? token.substring(7) : token);
        if(user == null){
            return false;
        }
        for(Long skillId : skillIds){
            Skill skill = skillRepository.findById(skillId).orElse(null);
            if(skill == null){
                return false;
            }
            UserSkill userSkill = new UserSkill();
            userSkill.setUser(user);
            userSkill.setSkill(skill);
            userSkillRepository.save(userSkill);
        }
        return true;
    }
    public boolean removeSkill(String token, Long skillId) {
        User user = getLoggedInUser(token.startsWith("Bearer ") ? token.substring(7) : token);
        if(user == null) return false;
        Skill skill = skillRepository.findById(skillId).orElse(null);
        if(skill == null) return false;
        UserSkill userSkill = userSkillRepository.findByUserAndSkill(user, skill);
        if(userSkill == null) return false;
        userSkillRepository.delete(userSkill);
        return true;
    }
    public List<FetchSkillDTO> getUserSkills(String token){
        User user = getLoggedInUser(token.startsWith("Bearer ") ? token.substring(7) : token);
        if(user == null) return null;
        return userSkillRepository.getUserSkills(user.getId());
    }
    public List<JobResponseDTO> getJobsForUser(String token){
        User user = getLoggedInUser(token.startsWith("Bearer ") ? token.substring(7) : token);
        if(user == null) return null;
        return jobService.findJobsForUser(user.getId());
    }
    public List<JobResponseDTO> searchJobs(String token, String searchQuery){
        User user = getLoggedInUser(token.substring(7));
        return jobService.searchJobs(searchQuery,user.getId());
    }
    public List<JobResponseDTO> searchFromAllJobs(String keyword){
        return jobService.searchJobs(keyword,null);}
    public boolean quickApplyForJob(String token,Long jobId) throws JsonProcessingException {
        User user = getLoggedInUser(token.startsWith("Bearer ") ? token.substring(7) : token);
        boolean status = applicationService.quickApplyForJob(user.getId(),jobId);
        if(status){
            String subject = "Job Application Received";
            String body = "You have successfully applied for the job. Your HR will quickly check your application";
            emailUtility.sendHtmlEmail(user.getEmail(),subject,body);
            return true;
        }
        return false;
    }
    public boolean manualApplyForJob(String token,ApplyJobDTO applyJobDTO, MultipartFile resume){
        User user = getLoggedInUser(token.startsWith("Bearer ") ? token.substring(7) : token);
        boolean status = applicationService.manualApplyForJob(applyJobDTO, resume);
        if(status){
            String subject = "Job Application Received";
            String body = "You have successfully applied for the job. Your HR will quickly check your application";
            emailUtility.sendHtmlEmail(user.getEmail(),subject,body);
            return true;
        } return false;
    }

    public String updateUserDetails(String token,User user){
        User user1 = getLoggedInUser(token.substring(7));
        user1.setEducation(user.getEducation());
        user1.setEmail(user.getEmail());
        user1.setExperience(user.getExperience());
        userRepository.save(user1);
        return "User details updated successfully";
    }
    @Async
    public String updateProfileImage(String token,MultipartFile profileImage){
        User user = getLoggedInUser(token.substring(7));
        user.setProfile_image(cloudinaryUtil.uploadFile(profileImage));
        userRepository.save(user);
        return "Profile image updated successfully";
    }
    @Async
    public String updateResume(String token,MultipartFile resume){
        User user = getLoggedInUser(token.substring(7));
        user.setResume(fileStorageUtil.storeFile(resume));;
        userRepository.save(user);
        return "Resume updated successfully";
    }
    public String deleteAccount(String token, int otp){
        User user = getLoggedInUser(token.substring(7));
        if(otpService.validateOtp(user.getEmail(), otp)){
        userRepository.delete(user);
        return "Account deleted successfully";}
        return "Invalid OTP";
    }
    public User getLoggedInUser(String token){
        String email = jwtUtil.getEmailFromToken(token, false);
        return userRepository.findByEmail(email);
    }
    public boolean userPremiumVerify(String token){
        User user = getLoggedInUser(token.substring(7));
        return user.isHasPremium();
    }
    public String sendGrievance(String token, String message){
        User user = getLoggedInUser(token.substring(7));
        GrievanceStore grievance = new GrievanceStore();
        grievance.setRole("USER");
        grievance.setSender_email(user.getEmail());
        grievance.setSender_name(user.getName());
        grievance.setGrievance(message);
        grievance.setStatus(false);
        grievanceRepo.save(grievance);
        return "Grievance sent successfully";
    }
}
