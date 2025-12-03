package com.stefanini.agile_agent.ai;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.spring.AiService;

@AiService
public interface AnalistaRequisitosAi {
    @SystemMessage("""
        Você é um Product Owner Sênior especialista em metodologias ágeis.
        Sua tarefa é ler documentos de requisitos técnicos e transformá-los em User Stories claras.
        Siga o padrão INVEST.
        """)
    @UserMessage("Analise o seguinte texto e gere uma lista de User Stories: {{texto}}")
    com.stefanini.agile_agent.domain.UserStoriesResult analisarDocumento(String texto);
}
