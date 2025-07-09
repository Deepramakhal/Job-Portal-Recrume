package recru.me.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import recru.me.backend.dto.FetchSkillDTO;
import recru.me.backend.model.Skill;
import recru.me.backend.model.User;
import recru.me.backend.model.UserSkill;

import java.util.List;

@Repository
public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {
    UserSkill findByUserAndSkill(User user, Skill skill);

    @Query("SELECT s.name AS name,s.id As id FROM UserSkill us JOIN us.skill s WHERE us.user.id = :userId")
    List<FetchSkillDTO> getUserSkills(@Param("userId") Long userId);
    @Query("SELECT s.name FROM UserSkill us JOIN us.skill s WHERE us.user.id = :userId")
    List<String> findSkillNamesByUserId(Long userId);
    @Query("SELECT us.skill.id FROM UserSkill us WHERE us.user.id = :userId")
    List<Long> findSkillIdsByUserId(@Param("userId") Long userId);
    List<UserSkill> findByUserId(Long userId);
}