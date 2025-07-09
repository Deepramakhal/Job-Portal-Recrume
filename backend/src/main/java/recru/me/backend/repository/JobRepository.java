package recru.me.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import recru.me.backend.dto.JobResponseDTO;
import recru.me.backend.model.Job;

import java.util.Collection;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job,Long> {
    @Query("Select j from Job j where j.postedBy = :recruiterId")
    public List<Job> findJobByRecruiterId(@Param("recruiterId") Long recruiterId);
    @Query("SELECT j FROM Job j WHERE LOWER(j.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(j.company) LIKE LOWER(CONCAT('%', :query, '%'))")
    public List<Job> searchJobs(@Param("query") String query);
    List<Job> findByPostedBy(Long recruiterId);
    @Query("Select j.id from Job j order by j.id desc limit 1")
    Long getLatestJobId();
}
