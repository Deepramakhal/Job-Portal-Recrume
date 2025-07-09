package recru.me.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import recru.me.backend.model.SavedJobs;

import java.util.List;
import java.util.Optional;

public interface SavedJobsRepository extends JpaRepository<SavedJobs,Long> {
    @Query("Select s from SavedJobs s where s.user_id = :userId")
    public List<SavedJobs> findByUserId(@Param("userId") Long userId);

    @Query("Select s from SavedJobs s where s.user_id = :userId and s.job_id = :jobId")
    Optional<SavedJobs> findByUser_idAndJob_id(@Param("userId") Long id, @Param("jobId") Long jobId);
}
