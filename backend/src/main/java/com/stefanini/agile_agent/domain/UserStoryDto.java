package com.stefanini.agile_agent.domain;

import java.util.List;

public record UserStoryDto(String titulo, String descricao, List<String> criteriosAceite, Integer estimativaPontos) {
}
