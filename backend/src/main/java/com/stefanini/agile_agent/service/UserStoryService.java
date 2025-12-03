package com.stefanini.agile_agent.service;

import com.stefanini.agile_agent.ai.AnalistaRequisitosAi;
import com.stefanini.agile_agent.domain.UserStoryDto;
import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class UserStoryService {

    private final AnalistaRequisitosAi aiAgent;
    private final Tika tika;

    public UserStoryService(AnalistaRequisitosAi aiAgent) {
        this.aiAgent = aiAgent;
        this.tika = new Tika();
    }

    public List<UserStoryDto> processarArquivo(MultipartFile arquivo) {
        try {
            // 1. Extrai o texto puro do PDF/DOCX
            String textoExtraido = tika.parseToString(arquivo.getInputStream());

            var result = aiAgent.analisarDocumento(textoExtraido);

            // 2. (Opcional) Log para debug
            System.out.println("Texto extraído (início): " + textoExtraido.substring(0, Math.min(100, textoExtraido.length())));

            // 3. Manda para a IA estruturar
            return result.stories();

        } catch (IOException | org.apache.tika.exception.TikaException e) {
            throw new RuntimeException("Falha ao processar documento", e);
        }
    }
}
