package com.stefanini.agile_agent.service;

import com.stefanini.agile_agent.exceptions.UserAlreadyExistsException;
import com.stefanini.agile_agent.domain.RegisterUserRequestDTO;
import com.stefanini.agile_agent.entities.User;
import com.stefanini.agile_agent.repositories.UserRepository;
import jakarta.validation.Valid;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class RegisterUserService {

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder;

    public RegisterUserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(@Valid RegisterUserRequestDTO requestData) throws UserAlreadyExistsException {
        Boolean userAlreadyExists = userRepository.existsByEmail(requestData.email());

        if(userAlreadyExists) {
            throw new UserAlreadyExistsException("Erro: o usuário já existe");
        }

        User user = new User(requestData.username(), passwordEncoder.encode(requestData.password()), requestData.email());

        return userRepository.save(user);
    }
}
