package recru.me.backend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import recru.me.backend.dto.ApplyJobDTO;
import recru.me.backend.dto.FetchSkillDTO;
import recru.me.backend.dto.JobResponseDTO;
import recru.me.backend.model.Application;
import recru.me.backend.model.SavedJobs;
import recru.me.backend.model.Skill;
import recru.me.backend.model.User;
import recru.me.backend.repository.SkillRepository;
import recru.me.backend.services.ApplicationService;
import recru.me.backend.services.JobService;
import recru.me.backend.services.UserService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin("http://localhost:5173")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private JobService jobService;
    @Autowired
    private ApplicationService applicationService;

    @GetMapping("")
    public User getLoggedInUser(@RequestHeader("Authorization") String token){
        return userService.getLoggedInUser(token.substring(7));
    }
    @GetMapping("/hasPremium")
    public ResponseEntity<Map<String, Boolean>> userPremiumVerify(@RequestHeader("Authorization") String token) {
        try{
            boolean hasPremium = userService.userPremiumVerify(token);
            System.out.print(token);
            Map<String, Boolean> response = new HashMap<>();
            response.put("hasPremium", hasPremium);
            return ResponseEntity.ok(response);
        } catch(Exception e){
            System.out.println(token + "\n " + e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }


    @PatchMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestHeader(value = "Authorization") String token,
                                                 @RequestHeader(value = "oldPassword") String oldPassword,
                                                 @RequestHeader(value = "newPassword" ) String newPassword,
                                                 @RequestHeader(value = "otp") int OTP){
        String response = userService.changePassword(token.substring(7), oldPassword, newPassword, OTP);
        if(response.equals("Password changed successfully")) {
            return ResponseEntity.ok(response);
        } else return ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/add-skill")
    public ResponseEntity<String> addSkill(@RequestHeader(value = "Authorization") String token,
                                           @RequestBody List<Long> skillIds){
        return userService.addSkill(token, skillIds) ? ResponseEntity.ok("Skill added successfully") : ResponseEntity.badRequest().body("Skill not added");
    }

    @PostMapping("/remove-skill/{skillId}")
    public ResponseEntity<String> removeSkill(@RequestHeader(value = "Authorization") String token,
                                              @PathVariable String skillId){
        return userService.removeSkill(token, Long.parseLong(skillId)) ? ResponseEntity.ok("Skill removed successfully") : ResponseEntity.badRequest().body("Skill not removed");
    }
    @GetMapping("/skills")
    public ResponseEntity<List<FetchSkillDTO>> getUserSkills(@RequestHeader(value = "Authorization") String token){
        return ResponseEntity.ok(userService.getUserSkills(token));
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<JobResponseDTO>> findJobsForUser(@RequestHeader(value = "Authorization") String token) {
        List<JobResponseDTO> jobs = userService.getJobsForUser(token);
        if (jobs == null) {
            return ResponseEntity.status(404).body(null);
        }
        return ResponseEntity.ok(jobs);
    }
    @PostMapping("/quick-apply/{jobId}")
    public ResponseEntity<String> quickApplyForJob(@RequestHeader(value = "Authorization") String token,
                                                   @PathVariable Long jobId) throws JsonProcessingException {
        return userService.quickApplyForJob(token.substring(7), jobId) ? ResponseEntity.ok("Job applied successfully") : ResponseEntity.status(500).body("Internal server error");
    }

    @PostMapping("/apply")
    public ResponseEntity<String> manualAppyForJob(@RequestHeader(value = "Authorization") String token,
                                                   @RequestPart("data") ApplyJobDTO data,
                                                   @RequestPart("resume")MultipartFile resume){
        return userService.manualApplyForJob(token,data,resume)? ResponseEntity.status(200).body("Success"):
                ResponseEntity.status(400).body("Failed");
    }

    @GetMapping("/jobs/{q}")
    public ResponseEntity<List<JobResponseDTO>> searchJobs(@RequestHeader(value = "Authorization") String token,
                                                           @PathVariable String q) {
        System.out.println(q);
        List<JobResponseDTO> jobs = userService.searchJobs(token,q);
        if (jobs == null) {
            return ResponseEntity.status(404).body(null);
        }
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/job/save/{jobId}")
   public ResponseEntity<String> saveJob(@RequestHeader(value = "Authorization") String token,
                                         @PathVariable Long jobId){
        return jobService.saveJob(token,jobId)?ResponseEntity.status(200).body("Job saved successfully"):
                ResponseEntity.status(404).body("Job already saved");
   }
    @GetMapping("/saved/jobs")
    public ResponseEntity<List<JobResponseDTO>> getSavedJobs(@RequestHeader(value = "Authorization") String token){
        List<JobResponseDTO> savedJobs = jobService.getSavedJobs(token);
        if(savedJobs.isEmpty()) return ResponseEntity.status(404).body(null);
        return ResponseEntity.status(200).body(savedJobs);
    }

    @GetMapping("/applied-jobs")
    public List<Application> getAppliedJobs(@RequestHeader(value = "Authorization") String token){
        return applicationService.getAppliedJobs(token);
    }
    @PostMapping("/update")
    public ResponseEntity<String> updateUserDetails(@RequestHeader("Authorization") String token,
                                                    @RequestBody User user){
        return ResponseEntity.ok(userService.updateUserDetails(token,user));
    }
    @PostMapping("/update/profile-image")
    public ResponseEntity<String> updateProfileImage(@RequestHeader("Authorization") String token,
                                                     @RequestPart MultipartFile pp){
        return ResponseEntity.ok(userService.updateProfileImage(token,pp));
    }
    @PostMapping("/update/resume")
    public ResponseEntity<String> updateResume(@RequestHeader("Authorization") String token,
                                               @RequestPart MultipartFile resume){
        return ResponseEntity.ok(userService.updateResume(token,resume));
    }
    @DeleteMapping("/delete-account")
    public ResponseEntity<String> deleteAccount(@RequestHeader("Authorization") String token,
                                                @RequestBody int Otp){
        return ResponseEntity.ok(userService.deleteAccount(token,Otp));
    }
    @GetMapping("/public/jobs")
    public ResponseEntity<List<JobResponseDTO>> getALlShuffledJobs(){
        return ResponseEntity.ok(jobService.getAllJobs());
    }
    @GetMapping("/public/jobs/{q}")
    public ResponseEntity<List<JobResponseDTO>> searchJobsForPublic(@PathVariable String q){
        return ResponseEntity.ok(userService.searchFromAllJobs(q));
    }
    @PostMapping("/send-grievance")
    public String sendGrievance(@RequestHeader("Authorization") String token,@RequestBody String message){
        return userService.sendGrievance(token,message);
    }
}
