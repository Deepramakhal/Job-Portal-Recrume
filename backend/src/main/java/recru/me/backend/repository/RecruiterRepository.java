package recru.me.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import recru.me.backend.model.Recruiter;

import java.util.List;

@Repository
public interface RecruiterRepository extends JpaRepository<Recruiter,Long> {
    Recruiter findByEmail(String email);
    boolean existsByEmail(String email);
    @Query(value = "SELECT * FROM recruiter WHERE is_verified=false",nativeQuery = true)
    List<Recruiter> findUnVerifiedRecruiters();
}
