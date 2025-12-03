package com.stefanini.agile_agent.controller;

import com.stefanini.agile_agent.domain.LoginRequestDTO;
import com.stefanini.agile_agent.domain.LoginResponseDTO;
import com.stefanini.agile_agent.domain.RegisterUserRequestDTO;
import com.stefanini.agile_agent.entities.User;
import com.stefanini.agile_agent.service.AuthenticationService;
import com.stefanini.agile_agent.service.RegisterUserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/auth")
public class AuthenticationController {
    private final AuthenticationService authService;
    private final RegisterUserService registerService;

    public AuthenticationController(AuthenticationService authService, RegisterUserService registerService) {
        this.authService = authService;
        this.registerService = registerService;
    }

    @PostMapping(value = "/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid LoginRequestDTO requestData) throws Exception {
        String accessToken = authService.createAccessToken(requestData.email(), requestData.password());

        return ResponseEntity.ok(new LoginResponseDTO(accessToken, requestData.email()));
    }

    @PostMapping(value = "/register")
    public ResponseEntity<LoginResponseDTO> register(@RequestBody @Valid RegisterUserRequestDTO requestData) throws Exception {
        User user = registerService.register(requestData);
        String accessToken = authService.createAccessToken(requestData.email(), requestData.password());

        return ResponseEntity.ok(new LoginResponseDTO(accessToken, requestData.email()));
    }
}
