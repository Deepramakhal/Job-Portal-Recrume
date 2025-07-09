package recru.me.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import recru.me.backend.dto.RecRegistrationDTO;
import recru.me.backend.dto.UserRegistrationDTO;
import recru.me.backend.model.Recruiter;
import recru.me.backend.model.Role;
import recru.me.backend.model.User;
import recru.me.backend.repository.RecruiterRepository;
import recru.me.backend.repository.UserRepository;
import recru.me.backend.util.CloudinaryUtil;
import recru.me.backend.util.EmailUtility;
import recru.me.backend.util.FileStorageUtil;
import recru.me.backend.util.JwtUtil;

import java.time.Duration;
import java.time.Instant;
import java.util.Date;

@Service
public class AuthService {
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private UserRepository userRepository;
    @Autowired private RecruiterRepository recruiterRepository;
    @Autowired private CloudinaryUtil cloudinaryUtil;
    @Autowired private FileStorageUtil fileStorageUtil;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private EmailUtility emailUtility;
    @Autowired private OtpService otpService;
    String defaultProfileImage = "https://res.cloudinary.com/deepraoncloud/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1747330613/temporary_paotx4.webp";
    public String loginUser(String email, String password) {
        Authentication authentication;
        try {
            authentication = authenticate(email, password);
        } catch (Exception e) {
            return "Invalid Credentials";
        }
        String authenticatedEmail = ((org.springframework.security.core.userdetails.User) authentication.getPrincipal()).getUsername();
        String role;
        System.out.println("authenticatedEmail" + authenticatedEmail);
        if (userRepository.existsByEmail(authenticatedEmail)) {
            role = "ROLE_USER";
        } else if (recruiterRepository.existsByEmail(authenticatedEmail)) {
            role = "ROLE_RECRUITER";
        } else {
            return "Invalid Credentials";
        }
        return jwtUtil.generateToken(authenticatedEmail, role);
    }
    private Authentication authenticate(String username, String password) {
        return authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
    }
    public String registerUser(UserRegistrationDTO userRegistrationDTO, MultipartFile profileImage, MultipartFile resume) {
        boolean isEmailExist = userRepository.existsByEmail(userRegistrationDTO.getEmail());
        boolean isEmailExistInRecruiter = recruiterRepository.existsByEmail(userRegistrationDTO.getEmail());
        if (isEmailExistInRecruiter) {return "Recruiter with this email already exists. You cannot register as a user";}
        if (isEmailExist) {return "User with this email already exists";}
        if(!userRegistrationDTO.getPassword().equals(userRegistrationDTO.getConfirmPassword())) {
            return "Passwords do not match";}
        if(userRegistrationDTO.getPassword().length() < 8) {
            return "Password must be at least 8 characters long";}
        String profileImageUrl = profileImage == null ? defaultProfileImage : cloudinaryUtil.uploadFile(profileImage);
        String resumeUrl = fileStorageUtil.storeFile(resume);
        String password = passwordEncoder.encode(userRegistrationDTO.getPassword());
        User user = new User();
        user.setName(userRegistrationDTO.getName());
        user.setEmail(userRegistrationDTO.getEmail());
        user.setPassword(password);
        user.setProfile_image(profileImageUrl);
        user.setEducation(userRegistrationDTO.getEducation());
        user.setExperience(userRegistrationDTO.getExperience());
        user.setResume(resumeUrl);
        user.setHomeCity(userRegistrationDTO.getHomeCity());
        user.setHasPremium(false);
        user.setRole(Role.USER);
        userRepository.save(user);
        return "User Registered Successfully";
    }
    public String registerRecruiter(RecRegistrationDTO recDto, MultipartFile profileImage,
                                    MultipartFile documents) {
        boolean isEmailExist = recruiterRepository.existsByEmail(recDto.getEmail());
        boolean isEmailExistInUser = userRepository.existsByEmail(recDto.getEmail());
        if (isEmailExistInUser) {
            return "User with this email already exists. You cannot register as a recruiter";
        }
        if (isEmailExist) {
            return "Recruiter with this email already exists";
        }
        if (!recDto.getPassword().equals(recDto.getConfirmPassword())) {
            return "Passwords do not match";
        }
        if (recDto.getPassword().length() < 8) {
            return "Password must be at least 8 characters long";
        }
        String encodedPassword = passwordEncoder.encode(recDto.getPassword());
        String profileImageUrl = profileImage == null ? defaultProfileImage : cloudinaryUtil.uploadFile(profileImage);
        String documentUrl = fileStorageUtil.storeFile(documents);
        Recruiter recruiter = new Recruiter();
        recruiter.setName(recDto.getName());
        recruiter.setEmail(recDto.getEmail());
        recruiter.setPassword(encodedPassword);
        recruiter.setCompany_id(recDto.getCompany_id());
        recruiter.setVerified(false);
        recruiter.setProfile_image(profileImageUrl);
        recruiter.setDocuments(documentUrl);
        recruiter.setRole(Role.RECRUITER);
        recruiterRepository.save(recruiter);
        return "Recruiter Registered Successfully";
    }
    public String sendOtp(String email, Role role){
        Date expirationTime = Date.from(Instant.now().plus(Duration.ofMinutes(10)));
        System.out.println(email + role);
        if(role == Role.USER){
            User user = userRepository.findByEmail(email);
            if(user == null){
                return "User with this email does not exist";
            }
            int otp = otpService.generateOtp();
            otpService.updateOtpByEmail(user.getEmail(), otp, expirationTime);
            emailUtility.sendHtmlEmail(user.getEmail(),"OTP",
                    "<h1>One time password:</h1>" + otp);
            return "Otp sent to your email";
        }
        else if(role == Role.RECRUITER){
            Recruiter recruiter = recruiterRepository.findByEmail(email);
            if(recruiter == null){
                return "Recruiter with this email does not exist";
            }
            int otp = otpService.generateOtp();
            otpService.updateOtpByEmail(recruiter.getEmail(), otp, expirationTime);
            emailUtility.sendHtmlEmail(recruiter.getEmail(),"OTP",
                    "<h1>One time password:</h1>" + otp);
            return "Otp sent to your email";
        }
        return "Something went wrong";
    }
    public String forgetPassword(String email,String password,String confirmPassword, int otp, Role role){
        if(role == Role.USER){
            User user = userRepository.findByEmail(email);
            if(user == null){
                return "User with this email does not exist";
            }
            if(!otpService.validateOtp(email, otp)){
                return "Invalid or expired Otp";
            }
            if(!password.equals(confirmPassword)){
                return "Passwords do not match";
            }
            String encodedPassword = passwordEncoder.encode(password);
            user.setPassword(encodedPassword);
            userRepository.save(user);
            return "Password changed successfully";
        }
        else if(role == Role.RECRUITER){
            Recruiter recruiter = recruiterRepository.findByEmail(email);
            if(recruiter == null){
                return "Recruiter with this email does not exist";
            }
            if(!otpService.validateOtp(email, otp)){
                return "Invalid expired Otp";
            }
            String encodedPassword = passwordEncoder.encode(password);
            recruiter.setPassword(encodedPassword);
            recruiterRepository.save(recruiter);
            return "Password changed successfully";
        }
        return "Something went wrong";
    }
}
