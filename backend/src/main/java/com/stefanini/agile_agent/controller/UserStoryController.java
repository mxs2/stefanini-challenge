package com.stefanini.agile_agent.controller;

import com.stefanini.agile_agent.domain.UserStoryDto;
import com.stefanini.agile_agent.service.JiraIntegrationService;
import com.stefanini.agile_agent.service.UserStoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stories")
public class UserStoryController {
    private final UserStoryService userStoryService;
    private final JiraIntegrationService jiraIntegrationService;

    public UserStoryController(UserStoryService userStoryService, JiraIntegrationService jiraIntegrationService) {
        this.userStoryService = userStoryService;
        this.jiraIntegrationService = jiraIntegrationService;
    }

    public record SyncRequest(List<UserStoryDto> stories, JiraCredentials credentials) {}
    
    public record JiraCredentials(String url, String username, String token, String projectKey) {}

    @PostMapping("/generate")
    public ResponseEntity<List<UserStoryDto>> generateStories(@RequestParam("file") MultipartFile file) {
        var stories = userStoryService.processarArquivo(file);

        return ResponseEntity.ok(stories);
    }

    @PostMapping("/sync")
    public ResponseEntity<Map<String, String>> syncStories(@RequestBody SyncRequest request) {
        if(request.stories() == null || request.stories().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "A lista de stories não pode estar vazia."));
        }
        if(request.credentials() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Credenciais do Jira são obrigatórias."));
        }
        
        jiraIntegrationService.criarCardsNoJira(request.stories(), request.credentials());

        return ResponseEntity.ok(Map.of("message", "Sucesso! As stories foram criadas no Jira."));
    }
}
