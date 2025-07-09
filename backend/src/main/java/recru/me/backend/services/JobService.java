package recru.me.backend.services;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import recru.me.backend.dto.JobResponseDTO;
import recru.me.backend.dto.NewJobDTO;
import recru.me.backend.model.*;
import recru.me.backend.repository.*;
import recru.me.backend.util.JwtUtil;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {
    @Autowired private JobRepository jobRepository;
    @Autowired private UserSkillRepository userSkillRepository;
    @Autowired private JobSkillRepository jobSkillRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private CompanyRepository companyRepository;
    @Autowired private RecruiterRepository repository;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private SkillRepository skillRepository;
    @Autowired private SavedJobsRepository savedJobsRepository;
    @Autowired private JobRecommendation jobRecommendation;
    public NewJobDTO createJobPosting(NewJobDTO newJobDTO, String token) throws JsonProcessingException {
        Recruiter recruiter = repository.findByEmail(jwtUtil.getEmailFromToken(token,false));
        if (recruiter == null) return null;

        Job job = new Job();
        job.setTitle(newJobDTO.getTitle());
        job.setDescription(newJobDTO.getDescription());
        job.setLocation(newJobDTO.getLocation());
        job.setWork_place(newJobDTO.getWork_place());
        job.setWork_mode(newJobDTO.getWork_mode());
        job.setExperience(newJobDTO.getExperience());
        job.setMin_salary(newJobDTO.getMin_salary());
        job.setMax_salary(newJobDTO.getMax_salary());
        job.setCompany(companyRepository.getCompanyNameById(newJobDTO.getCompanyId()));
        job.setCompanyLogo(companyRepository.getCompanyLogoById(newJobDTO.getCompanyId()));
        job.setDeadline(newJobDTO.getDeadline());
        job.setPostedBy(recruiter.getId());
        job.setPosted_at(new Date());
        Job savedJob = jobRepository.save(job);
        List<JobSkill> jobSkills = newJobDTO.getSkillIds().stream()
                .map(skillId -> new JobSkill(savedJob, skillRepository.findById(skillId).orElse(null)))
                .collect(Collectors.toList());
        jobSkillRepository.saveAll(jobSkills);
        jobRecommendation.sendJobRecommendation(newJobDTO.getSkillIds(),jobRepository.getLatestJobId());
        return newJobDTO;
    }
    public List<JobResponseDTO> findJobsForUser(Long userId) {
        Set<Long> userSkillIds = userSkillRepository.findByUserId(userId).stream()
                .map(us -> us.getSkill().getId())
                .collect(Collectors.toSet());

        Date now = new Date();

        return jobRepository.findAll().stream()
                .filter(job -> job.getDeadline() == null || job.getDeadline().after(now)) 
                .map(job -> convertToDTO(job, userSkillIds))
                .filter(Objects::nonNull)
                .sorted(Comparator.comparingInt(JobResponseDTO::getMatchingSkills).reversed())
                .collect(Collectors.toList());
    }
    public List<String> getJobSkills(Long jobId) {
        return jobSkillRepository.findByJobId(jobId).stream()
                .map(js -> js.getSkill().getName())
                .collect(Collectors.toList());
    }
    public List<JobResponseDTO> searchJobs(String keyword, Long userId) {
        Set<Long> userSkillIds = userSkillRepository.findByUserId(userId).stream()
                .map(us -> us.getSkill().getId())
                .collect(Collectors.toSet());

        return jobRepository.searchJobs(keyword).stream()
                .map(job -> convertToDTO(job, userSkillIds))
                .filter(Objects::nonNull)
                .sorted(Comparator.comparingInt(JobResponseDTO::getMatchingSkills).reversed())
                .collect(Collectors.toList());
    }
    public List<JobResponseDTO> searchFromAllJobs(String keyword){
        return jobRepository.searchJobs(keyword).stream()
                .map(job -> convertToDTO(job, null)) // no matching skill info
                .filter(Objects::nonNull)
                .sorted(Comparator.comparingInt(JobResponseDTO::getMatchingSkills).reversed())
                .collect(Collectors.toList());
    }
    public boolean saveJob(String token, Long jobId) {
        User user = userRepository.findByEmail(jwtUtil.getEmailFromToken(token.substring(7),false));
        if (user == null || !jobRepository.existsById(jobId)) return false;
        if(savedJobsRepository.findByUser_idAndJob_id(user.getId(),jobId).isPresent()) return false;
        SavedJobs savedJobs = new SavedJobs();
        savedJobs.setUser_id(user.getId());
        savedJobs.setJob_id(jobId);
        savedJobsRepository.save(savedJobs);
        return true;
    }
    public List<JobResponseDTO> getSavedJobs(String token) {
        String email = jwtUtil.getEmailFromToken(token.substring(7),false);
        User user = userRepository.findByEmail(email);
        if (user == null) return Collections.emptyList();

        return savedJobsRepository.findByUserId(user.getId()).stream()
                .map(saved -> jobRepository.findById(saved.getJob_id()).orElse(null))
                .filter(Objects::nonNull)
                .map(job -> convertToDTO(job, null)) // no matching skill info
                .collect(Collectors.toList());
    }
    public List<JobResponseDTO> getJobsByRecruiter(String token){
        Recruiter recruiter = repository.findByEmail(jwtUtil.getEmailFromToken(token.substring(7),false));
        if(recruiter == null) return null;
        return jobRepository.findJobByRecruiterId(recruiter.getId()).stream()
                .map(job -> convertToDTO(job, null)) // no matching skill info
                .collect(Collectors.toList());
    }

    public List<JobResponseDTO> getAllJobs() {
        List<Job> jobs = jobRepository.findAll();
        Collections.shuffle(jobs);
        return jobs.stream()
                .map(job -> convertToDTO(job, null))
                .collect(Collectors.toList());
    }


    // 🔄 Reusable private helper method
    public JobResponseDTO convertToDTO(Job job, Set<Long> userSkillIds) {
        List<JobSkill> jobSkills = jobSkillRepository.findByJobId(job.getId());
        Set<Long> jobSkillIds = jobSkills.stream()
                .map(js -> js.getSkill().getId())
                .collect(Collectors.toSet());

        int matchingSkillCount = 0;
        if (userSkillIds != null) {
            matchingSkillCount = (int) jobSkillIds.stream()
                    .filter(userSkillIds::contains)
                    .count();
        }
        JobResponseDTO dto = new JobResponseDTO();
        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setCompanyName(job.getCompany());
        dto.setCompanyLogo(job.getCompanyLogo());
        dto.setLocation(job.getLocation());
        dto.setWorkPlace(job.getWork_place());
        dto.setWorkMode(job.getWork_mode());
        dto.setMinSalary(job.getMin_salary());
        dto.setMaxSalary(job.getMax_salary());
        dto.setExperience(job.getExperience());
        dto.setDescription(job.getDescription());
        dto.setPostedAt(job.getPosted_at());
        dto.setDeadline(job.getDeadline());
        dto.setSkills(getJobSkills(job.getId()));
        dto.setMatchingSkills(matchingSkillCount);
        return dto;
    }
    public JobResponseDTO convertJobToDTO(Job job) {
        return convertToDTO(job, null); // Admin doesn’t need skill match info
    }
}


