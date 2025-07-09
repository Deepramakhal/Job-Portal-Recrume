package recru.me.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import recru.me.backend.model.Company;

public interface CompanyRepository extends JpaRepository<Company,Long> {
    @Query("SELECT c.logo FROM Company c WHERE c.id = :id")
    public String getCompanyLogoById(Long id);
    @Query("SELECT c.name FROM Company c WHERE c.id = :id")
    public String getCompanyNameById(Long id);
}
