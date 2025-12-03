package com.stefanini.agile_agent.client.jira.request;

import java.util.Map;

public record JiraIssueRequest(Fields fields) {
    public record Fields(Project project, String summary, Map<String, Object> description, Issuetype issuetype) {}

    public record Project(String key) {}
    public record Issuetype(String id) {}
}
