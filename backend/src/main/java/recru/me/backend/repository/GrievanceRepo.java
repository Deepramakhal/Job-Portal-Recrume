package recru.me.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import recru.me.backend.model.GrievanceStore;

import java.util.List;

@Repository
public interface GrievanceRepo extends JpaRepository<GrievanceStore,Long> {
    @Query("Select g from GrievanceStore g where g.status = false")
    List<GrievanceStore> findAllGrievances();
}
