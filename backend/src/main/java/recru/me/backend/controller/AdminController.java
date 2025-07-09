package recru.me.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import recru.me.backend.dto.JobResponseDTO;
import recru.me.backend.dto.RecruiterStatDTO;
import recru.me.backend.model.Company;
import recru.me.backend.model.GrievanceStore;
import recru.me.backend.model.Recruiter;
import recru.me.backend.services.AdminService;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin("http://localhost:5173")
public class AdminController {
    @Autowired private AdminService adminService;

    @GetMapping("/jobs")
    public ResponseEntity<List<JobResponseDTO>> getAllJobs(){
        return ResponseEntity.status(200).body(adminService.getAllJobs());
    }
    @PostMapping("/delete-job/{jobId}")
    public ResponseEntity<String> deleteJobPosting(@PathVariable Long jobId,
                                                   @RequestBody String reason){
        return ResponseEntity.status(200).body(adminService.deleteJobPosting(jobId,reason));
    }
    @PostMapping("/approve-recruiter/{recruiterId}")
    public ResponseEntity<String> approveRecruiter(@PathVariable Long recruiterId){
        System.out.println("recruiterId is here"+recruiterId);
        return ResponseEntity.status(200).body(adminService.approveRecruiters(recruiterId));
    }
    @PostMapping("/reject-recruiter/{recruiterId}")
    public ResponseEntity<String> rejectRecruiter(@PathVariable Long recruiterId,
                                                  @RequestBody String reason){
        return ResponseEntity.status(200).body(adminService.deleteRecruiter(recruiterId,reason));
    }

    @GetMapping("/recruiters")
    public ResponseEntity<List<Recruiter>> getAllRecruiters(){
        return ResponseEntity.status(200).body(adminService.getAllRecruiters());
    }
    @GetMapping("/recruiters-to-approve")
    public ResponseEntity<List<Recruiter>> getRecruitersToApprove(){
        return ResponseEntity.status(200).body(adminService.getRecruitersToApprove());
    }

    @GetMapping("/statistics")
    public List<RecruiterStatDTO> getStatistics(){
        return adminService.getRecruiterStatistics();
    }

    @PostMapping("/add-company/{name}")
    public ResponseEntity<Company> addCompany(@PathVariable String name,
                                              @RequestPart("description") String description,
                                              @RequestPart("logo") MultipartFile logo){
        return ResponseEntity.status(200).body(adminService.addCompany(name,description,logo));
    }
    @DeleteMapping("/remove-company/{companyId}")
    public ResponseEntity<String> removeCompany(@PathVariable Long companyId){
        return ResponseEntity.status(200).body(adminService.deleteCompany(companyId));
    }
    @GetMapping("/companies")
    public ResponseEntity<List<Company>> getAllCompanies(){
        return ResponseEntity.status(200).body(adminService.getAllCompanies());
    }
    @GetMapping("/grievances")
    public ResponseEntity<List<GrievanceStore>> getGrievances(){
        return ResponseEntity.status(200).body(adminService.getAllGrievances());
    }
    @PostMapping("/{grievanceId}")
    public String replyToGrievance(@PathVariable Long grievanceId){
        return adminService.grievanceStatusUpdate(grievanceId);
    }
}
