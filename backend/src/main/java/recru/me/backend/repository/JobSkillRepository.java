package recru.me.backend.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import recru.me.backend.model.JobSkill;

import java.util.List;

@Repository
public interface JobSkillRepository extends JpaRepository<JobSkill,Long> {
    @Query("SELECT s.name FROM Skill s WHERE s.id = :skillId")
    String findSkillNameById(@Param("skillId") Long skillId);
    @Query("SELECT s.name FROM JobSkill js JOIN js.skill s WHERE js.job.id = :jobId")
    String findSkillNameByJobId(@Param("jobId") Long jobId);

    List<JobSkill> findByJobId(Long id);
    @Transactional
    @Modifying
    @Query("DELETE FROM JobSkill js WHERE js.job.id = :jobId")
    void deleteByJobId(@Param("jobId") Long jobId);

}
