package recru.me.backend.security;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import recru.me.backend.services.CustomUserDetailsService;
import recru.me.backend.util.JwtUtil;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private CustomUserDetailsService customUserDetailsService;
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = extractTokenFromRequest(request);
        if (token != null) {
            String bearer = token.startsWith("Bearer ") ? token.substring(7) : token;

            boolean isAdminToken = false;
            String email = null;
            String role = null;

            // Try admin token parsing first
            try {
                if (jwtUtil.validateToken(bearer, true)) {
                    role = jwtUtil.getRoleFromToken(bearer, true);
                    if ("ROLE_ADMIN".equals(role)) {
                        isAdminToken = true;
                        email = jwtUtil.getEmailFromToken(bearer, true);
                    }
                }
            } catch (Exception ignored) {
            }
            if (!isAdminToken && jwtUtil.validateToken(bearer, false)) {
                email = jwtUtil.getEmailFromToken(bearer, false);
                role = jwtUtil.getRoleFromToken(bearer, false);
                System.out.println("Injecting email: " + email + " role: " + role);
            }

            if (email != null && role != null) {
                var authorities = List.of(new SimpleGrantedAuthority(role));
                System.out.println("Injecting authority: " + role);
                var authentication = new UsernamePasswordAuthenticationToken(email, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }
    private String extractTokenFromRequest(jakarta.servlet.http.HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        return header != null && header.startsWith("Bearer ") ? header.substring(7) : null;
    }
}
