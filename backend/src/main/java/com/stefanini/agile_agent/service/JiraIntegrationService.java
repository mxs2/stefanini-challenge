package com.stefanini.agile_agent.service;

import com.stefanini.agile_agent.client.jira.JiraClient;
import com.stefanini.agile_agent.controller.UserStoryController;
import com.stefanini.agile_agent.domain.UserStoryDto;
import com.stefanini.agile_agent.client.jira.request.JiraIssueRequest;
import feign.Feign;
import feign.auth.BasicAuthRequestInterceptor;
import feign.jackson.JacksonDecoder;
import feign.jackson.JacksonEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class JiraIntegrationService {

    public void criarCardsNoJira(List<UserStoryDto> stories, UserStoryController.JiraCredentials credentials) {
        // Create a Feign client with dynamic credentials
        JiraClient jiraClient = Feign.builder()
                .encoder(new JacksonEncoder())
                .decoder(new JacksonDecoder())
                .requestInterceptor(new BasicAuthRequestInterceptor(credentials.username(), credentials.token()))
                .target(JiraClient.class, credentials.url());
        
        for (UserStoryDto story : stories) {
            var request = montarPayloadJira(story, credentials.projectKey());
            jiraClient.createIssue(request);
        }
    }

    private JiraIssueRequest montarPayloadJira(UserStoryDto story, String projectKey) {
        // Montando o ADF (Rich Text do Jira) na mão via Map
        Map<String, Object> adfDescription = Map.of(
                "type", "doc",
                "version", 1,
                "content", List.of(
                        Map.of(
                                "type", "paragraph",
                                "content", List.of(
                                        Map.of(
                                                "type", "text",
                                                "text", story.descricao() + "\n\nCritérios:\n" + String.join("\n- ", story.criteriosAceite())
                                        )
                                )
                        )
                )
        );

        return new JiraIssueRequest(new JiraIssueRequest.Fields(
                new JiraIssueRequest.Project(projectKey),
                story.titulo(),
                adfDescription,
                new JiraIssueRequest.Issuetype("10004")
        ));
    }
}
