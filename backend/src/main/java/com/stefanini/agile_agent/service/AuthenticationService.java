package com.stefanini.agile_agent.service;

import com.stefanini.agile_agent.entities.User;
import com.stefanini.agile_agent.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;

    private final JwtEncoder jwtEncoder;

    private final BCryptPasswordEncoder passwordEncoder;

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    private String appIssuer;

    public AuthenticationService(UserRepository userRepository, JwtEncoder jwtEncoder, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.jwtEncoder = jwtEncoder;
        this.passwordEncoder = bCryptPasswordEncoder;
    }

    public String createAccessToken(String email, String password) throws Exception {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new BadCredentialsException("Credenciais inválidas."));

        boolean correctPassword = passwordEncoder.matches(password, user.getPassword());

        if(!correctPassword) {
            throw new BadCredentialsException("Credenciais inválidas");
        }

        var claims = JwtClaimsSet.builder()
                .issuer(appIssuer)
                .subject(email)
                .expiresAt(Instant.now().plusSeconds(900))
                .issuedAt(Instant.now())
                .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }
}
