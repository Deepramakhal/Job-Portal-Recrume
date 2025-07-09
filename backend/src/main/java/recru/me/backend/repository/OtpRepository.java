package recru.me.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import recru.me.backend.model.Otp;

import java.util.Date;

@Repository
public interface OtpRepository extends JpaRepository<Otp,String>{
    @Modifying
    @Transactional
    @Query("UPDATE Otp o SET o.Otp = :otp, o.expirationTime = :expirationTime WHERE o.email = :email")
    void updateOtpByEmail(String email, int otp, Date expirationTime);
    Otp findByEmail(String email);
}
