package recru.me.backend.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    private final Key key;
    private final Key adminKey;
    private final long expirationTime;
    public JwtUtil(@Value("${jwt.secret}") String secret,
                   @Value("${jwt.expiration}") long expirationTime,
                   @Value("${admin.secret}") String adminSecret) {
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        this.adminKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(adminSecret));
        this.expirationTime = expirationTime;
    }
    public String generateToken(String email, String role) {
        return Jwts.builder()
                .subject(email)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(role.equals("ROLE_ADMIN") ? adminKey : key)
                .compact();
    }
    public boolean validateToken(String token, boolean isAdmin) {
        try {
            Jwts.parser()
                    .verifyWith((SecretKey) (isAdmin ? adminKey : key))
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
    public String getEmailFromToken(String token, boolean isAdmin) {
        Claims claims = Jwts.parser()
                .verifyWith((SecretKey) (isAdmin ? adminKey : key))
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }
    public String getRoleFromToken(String token, boolean isAdmin) {
        Claims claims = Jwts.parser()
                .verifyWith((SecretKey) (isAdmin ? adminKey : key))
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.get("role", String.class);
    }
}

