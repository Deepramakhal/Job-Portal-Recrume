package recru.me.backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import recru.me.backend.services.CustomUserDetailsService;

import java.util.List;

@Configuration
public class SecurityConfig {
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtFilter jwtFilter;
    @Autowired
    public SecurityConfig(CustomUserDetailsService customUserDetailsService, JwtFilter jwtFilter) {
        this.customUserDetailsService = customUserDetailsService;
        this.jwtFilter = jwtFilter;
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors
                        .configurationSource(request -> {
                            var config = new org.springframework.web.cors.CorsConfiguration();
                            config.setAllowedOrigins(List.of("http://localhost:5173"));
                            config.setAllowedMethods(List.of("GET", "POST", "PUT","PATCH", "DELETE", "OPTIONS"));
                            config.setAllowedHeaders(List.of("*"));
                            config.setAllowCredentials(true);
                            return config;
                        })
                )
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/user/public/**").permitAll()
                        .requestMatchers("/api/recruiter/all-companies").permitAll()
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/api/recruiter/uploads/**").permitAll()
                        .requestMatchers("/admin/**").hasAnyRole("ADMIN")
                        .requestMatchers("/api/user/**").hasAnyRole("USER","ADMIN")
                        .requestMatchers("/api/recruiter/**").hasAnyRole("RECRUITER","ADMIN")
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider()) // Register provider
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authBuilder.authenticationProvider(authenticationProvider());
        return authBuilder.build();
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
