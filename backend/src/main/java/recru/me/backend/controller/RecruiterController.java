package recru.me.backend.controller;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import recru.me.backend.dto.JobResponseDTO;
import recru.me.backend.dto.NewJobDTO;
import recru.me.backend.model.Application;
import recru.me.backend.model.Company;
import recru.me.backend.model.Job;
import recru.me.backend.model.Recruiter;
import recru.me.backend.services.ApplicationService;
import recru.me.backend.services.JobService;
import recru.me.backend.services.RecruiterService;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/recruiter")
@CrossOrigin("http://localhost:5173")
public class RecruiterController {
    @Autowired
    private RecruiterService recruiterService;
    @Autowired
    private ApplicationService applicationService;
    @Autowired
    private JobService jobService;

    @GetMapping("")
    public Recruiter getLoggedInRecruiter(@RequestHeader (value = "Authorization") String token) {
        return recruiterService.getLoggedInRecruiter(token.substring(7));
    }

    @PatchMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestHeader(value = "Authorization") String token,
                                                 @RequestHeader(value = "oldPassword") String oldPassword,
                                                 @RequestHeader(value = "newPassword" ) String newPassword,
                                                 @RequestHeader(value = "otp") int OTP){
        return ResponseEntity.ok(recruiterService.changePassword(token.substring(7), oldPassword, newPassword, OTP));
    }

    @PostMapping("/new")
    public ResponseEntity<NewJobDTO> createJobPosting(@RequestHeader (value = "Authorization") String token,
                                                      @RequestBody NewJobDTO newJobDTO) throws JsonProcessingException {
        NewJobDTO newJobDTO1 = recruiterService.newJob(newJobDTO, token);
        if (newJobDTO1 == null) {
            return ResponseEntity.status(404).body(null);
        } else {
            return ResponseEntity.ok(newJobDTO1);
        }
    }
        @PatchMapping("/edit-job/{jobId}/{deadline}")
        public ResponseEntity<String> updateJobPosting(@RequestHeader (value = "Authorization") String token,
                                                       @PathVariable Long jobId,
                                                       @PathVariable String deadline) throws ParseException {
            Date convertedDate = new SimpleDateFormat("yyyy-MM-dd").parse(deadline);
            return ResponseEntity.ok(recruiterService.editJobDeadline(token,jobId,convertedDate));
        }

    @DeleteMapping("/delete-job/{jobId}/{otp}")
    public ResponseEntity<String> deleteJob(@RequestHeader (value = "Authorization") String token,
                                            @PathVariable Long jobId,
                                            @PathVariable int otp) {
        return ResponseEntity.ok(recruiterService.deleteJobPosting(token, jobId,otp));
    }

    @GetMapping("/posted-jobs")
    public ResponseEntity<List<JobResponseDTO>> getJobsByRecruiter(@RequestHeader("Authorization") String token) {
        List<JobResponseDTO> jobResponseDTO = jobService.getJobsByRecruiter(token);
        if(jobResponseDTO == null) return ResponseEntity.status(404).body(null);
        return ResponseEntity.ok(jobResponseDTO);
    }
    @GetMapping("/job/{jobId}")
    public ResponseEntity<JobResponseDTO> getPostedJobDetails(@RequestHeader("Authorization") String token,
                                                              @PathVariable Long jobId) {
        JobResponseDTO jobResponseDTO = recruiterService.getJobDetails(token, jobId);
        if(jobResponseDTO == null) return ResponseEntity.status(404).body(null);
        return ResponseEntity.ok(jobResponseDTO);
    }
    @GetMapping("/applications/{jobId}")
    public ResponseEntity<List<Application>> getApplications(
            @PathVariable Long jobId){
        List<Application> applications = applicationService.getApplicationsByJobId(jobId);
        if(applications.isEmpty()) return ResponseEntity.status(404).body(null);
        return ResponseEntity.status(200).body(applications);
    }
    @PostMapping(value = "/schedule-interview/{applicationId}", consumes = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> scheduleInterview(@PathVariable Long applicationId, @RequestBody String interviewTime) {
        try {
            // Ensure interviewTime is clean and properly formatted
            String cleanDateStr = interviewTime.trim().replace("\"", "");
            Instant instant = Instant.parse(cleanDateStr);
            Date date = Date.from(instant);

            applicationService.scheduleInterview(applicationId, date);
            return ResponseEntity.ok("Interview Scheduled");
        } catch (Exception e) {
            e.printStackTrace(); // For better debugging
            return ResponseEntity.badRequest().body("Invalid date format: " + e.getMessage());
        }
    }
    @PostMapping("/application-status/{applicationId}/{status}")
    public ResponseEntity<String> applicationStatusUpdate(@PathVariable Long applicationId,
                                                          @PathVariable String status){
        return ResponseEntity.ok(applicationService.applicationStatus(applicationId,status));
    }
    @PatchMapping("/change-company/{companyId}")
    public ResponseEntity<String> changeCompany(@RequestHeader("Authorization") String token,
                                                @PathVariable Long companyId) {
        return ResponseEntity.ok(recruiterService.updateCompany(token,companyId));
    }
    @PostMapping("/update/profile-image")
    public ResponseEntity<String> updateProfileImage(@RequestHeader("Authorization") String token,
                                                     @RequestPart MultipartFile profileImage) {
        return ResponseEntity.ok(recruiterService.updateProfileImage(token,profileImage));
    }
    @PostMapping("/update/documents")
    public ResponseEntity<String> updateDocuments(@RequestHeader("Authorization") String token,
                                                  @RequestPart MultipartFile documents) {
        return ResponseEntity.ok(recruiterService.updateDocuments(token,documents));
    }
    @DeleteMapping("/delete-profile/{otp}")
    public ResponseEntity<String> deleteProfile(@RequestHeader("Authorization") String token,
                                                @PathVariable int otp) {
        return ResponseEntity.ok(recruiterService.deleteAccount(token,otp));
    }
    @GetMapping("/all-companies")
    public ResponseEntity<List<Company>> getAllCompany(){
        return ResponseEntity.ok(recruiterService.getAllCompany());
    }
    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path file = Paths.get("uploads").resolve(filename).normalize();
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() && resource.isReadable()) {
                // Guess MIME type based on file extension
                String contentType = "application/pdf"; // You can generalize with Files.probeContentType(path) for other file types
                return ResponseEntity.ok()
                        .contentType(org.springframework.http.MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @GetMapping("/upcoming-interviews")
    public ResponseEntity<List<Job>> getAllJobsWithNearbyInterviews() {
        return ResponseEntity.ok(applicationService.getJobsWithUpcomingInterviews());
    }
    @GetMapping("/accepted-applications/{jobId}")
    public ResponseEntity<List<Application>> getAcceptedApplications(
            @PathVariable Long jobId){
        return ResponseEntity.ok(applicationService.getAcceptedApplications(jobId));
    }
    @PostMapping("/send-grievance")
    public String sendGrievance(@RequestHeader("Authorization") String token,@RequestBody String message){
        return recruiterService.sendGrievance(token,message);
    }
}
