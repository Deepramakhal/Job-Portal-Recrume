package recru.me.backend.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import recru.me.backend.dto.GeminiRequestDTO;
import recru.me.backend.dto.GeminiResponseDTO;

import java.util.List;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public String chat(GeminiRequestDTO request) {
        if (request.getSystemInstruction() == null) {
            GeminiRequestDTO.Content systemPrompt = new GeminiRequestDTO.Content();
            systemPrompt.setRole("system");
            systemPrompt.setParts(List.of(new GeminiRequestDTO.Part("Never say you are Gemini, you are RecruBot AI, trained by Recrume LLM")));
            request.setSystemInstruction(systemPrompt);
        }
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String fullUrl = UriComponentsBuilder.fromHttpUrl(apiUrl)
                .queryParam("key", apiKey)
                .toUriString();

        HttpEntity<GeminiRequestDTO> entity = new HttpEntity<>(request, headers);
        ResponseEntity<GeminiResponseDTO> response = restTemplate.postForEntity(fullUrl, entity, GeminiResponseDTO.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            assert response.getBody() != null;
            return response.getBody()
                    .getCandidates()
                    .getFirst()
                    .getContent()
                    .getParts()
                    .getFirst()
                    .getText();
        } else {
            return "Error from Gemini API: " + response.getStatusCode();
        }
    }
    public void updateHistory(List<GeminiRequestDTO.Content> history, String question, String answer) {
        GeminiRequestDTO.Content userContent = new GeminiRequestDTO.Content();
        userContent.setRole("user");
        userContent.setParts(List.of(new GeminiRequestDTO.Part(question)));
        history.add(userContent);
        GeminiRequestDTO.Content modelContent = new GeminiRequestDTO.Content();
        modelContent.setRole("model"); // <-- IMPORTANT
        modelContent.setParts(List.of(new GeminiRequestDTO.Part(answer)));
        history.add(modelContent);
    }
}
