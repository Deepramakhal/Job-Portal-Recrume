package recru.me.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import recru.me.backend.model.Application;
import recru.me.backend.model.Job;

import java.util.Date;
import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    @Query("SELECT a FROM Application a WHERE a.job_id = :jobId")
    List<Application> findByJob_id(@Param("jobId") Long jobId);
    List<Application> findByEmail(String email);
    @Query(value = "SELECT * FROM application WHERE job_id IN (:jobIds)", nativeQuery = true)
    List<Application> findByJobIdsNative(@Param("jobIds") List<Long> jobIds);
    @Query(value = """
    SELECT job_id, interview_date
    FROM application
    WHERE interview_date IS NOT NULL
      AND interview_date BETWEEN CURDATE() AND :futureDate
    ORDER BY interview_date
    """, nativeQuery = true)
    List<Object[]> findJobIdsAndInterviewDates(@Param("futureDate") Date futureDate);

    @Query("Select a from Application a where a.job_id = :jobId and a.status = true and a.isAccepted = true")
    List<Application> getAcceptedApplications(@Param("jobId") Long jobId);
}
