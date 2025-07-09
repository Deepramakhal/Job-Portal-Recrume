package recru.me.backend.services;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import recru.me.backend.model.User;
import recru.me.backend.model.Recruiter;
import recru.me.backend.repository.UserRepository;
import recru.me.backend.repository.RecruiterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CustomUserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RecruiterRepository recruiterRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));
            return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), authorities);
        }

        Recruiter recruiter = recruiterRepository.findByEmail(email);
        if (recruiter != null) {
            List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_RECRUITER"));
            return new org.springframework.security.core.userdetails.User(recruiter.getEmail(), recruiter.getPassword(), authorities);
        }

        throw new UsernameNotFoundException("User not found with email: " + email);
    }
}

