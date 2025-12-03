package com.stefanini.agile_agent.client.jira;

import com.stefanini.agile_agent.client.jira.request.JiraIssueRequest;
import feign.Headers;
import feign.RequestLine;

public interface JiraClient {
    @RequestLine("POST /rest/api/3/issue")
    @Headers("Content-Type: application/json")
    void createIssue(JiraIssueRequest request);
}
