package recru.me.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import recru.me.backend.dto.ForgetPasswordDTO;
import recru.me.backend.dto.RecRegistrationDTO;
import recru.me.backend.dto.UserRegistrationDTO;
import recru.me.backend.model.Role;
import recru.me.backend.model.Skill;
import recru.me.backend.repository.GrievanceRepo;
import recru.me.backend.repository.SkillRepository;
import recru.me.backend.services.AdminService;
import recru.me.backend.services.AuthService;
import recru.me.backend.dto.LoginDTO;

import java.util.List;

@RestController
@RequestMapping("/auth")
@CrossOrigin("http://localhost:5173")
public class AuthController {
    @Autowired private AuthService authService;
    @Autowired private AdminService adminService;
    @Autowired private SkillRepository skillRepository;

    @PostMapping("/admin/login")
    public String adminLogin(@RequestHeader("admin-email") String email,
                             @RequestHeader("admin-password") String password,
                             @RequestHeader("admin-secret") String secret) {
        return adminService.adminLogin(email, password, secret);
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginDTO loginDTO) {
        String jwtToken = authService.loginUser(loginDTO.getEmail(),loginDTO.getPassword());
        if (jwtToken != null) {
            return jwtToken;
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }

    @PostMapping(value = "/register/user", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> registerUser(@RequestPart("data") UserRegistrationDTO userRegistrationDTO,
                                       @RequestPart("profileImage") MultipartFile profileImage,
                                       @RequestPart("resume") MultipartFile resume) {
        String response = authService.registerUser(userRegistrationDTO, profileImage, resume);
        if(response.equals("User Registered Successfully")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    @PostMapping(value = "/register/recruiter", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> registerRecruiter(@RequestPart("data") RecRegistrationDTO recDto,
                                       @RequestPart("profileImage") MultipartFile profileImage,
                                                    @RequestPart("documents") MultipartFile documents) {
        String response = authService.registerRecruiter(recDto, profileImage, documents);
        if (response.equals("Recruiter Registered Successfully")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/forget-password")
    public ResponseEntity<String> forgetPassword(@RequestBody ForgetPasswordDTO data){
        if(!data.getPassword().equals(data.getConfirmPassword())){
            return ResponseEntity.badRequest().body("Passwords do not match");
        }
        String response = authService.forgetPassword(data.getEmail(),
                 data.getPassword(),data.getConfirmPassword(),data.getOtp(),data.getRole());
        if(response.equals("Password changed successfully")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestBody ForgetPasswordDTO.sendOtpDTO data){
        return ResponseEntity.ok(authService.sendOtp(data.getEmail(),data.getRole()));
    }
    @GetMapping("/all-skills")
    public List<Skill> getAllSkills(){
        return skillRepository.findAll();
    }
    @GetMapping("/all-skill-names")
    public List<String> getAllSkillNames(){
        return skillRepository.getAllSkillNames();
    }
}
