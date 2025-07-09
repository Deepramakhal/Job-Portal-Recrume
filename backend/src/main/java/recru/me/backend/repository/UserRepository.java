package recru.me.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import recru.me.backend.model.User;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    User findByEmail(String email);
    boolean existsByEmail(String email);
    @Query("Select u from User u where u.hasPremium=true")
    List<User> getUsersForRecommendationService();
}
