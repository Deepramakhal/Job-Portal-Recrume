package recru.me.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import recru.me.backend.model.Skill;

import java.util.List;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    @Query("SELECT s.name FROM Skill s")
    List<String> getAllSkillNames();
}
