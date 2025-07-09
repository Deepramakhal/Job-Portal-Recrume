package recru.me.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import recru.me.backend.dto.GeminiRequestDTO;
import recru.me.backend.services.GeminiService;

import java.util.List;

@RestController
@RequestMapping("/api/gemini")
@CrossOrigin("http://localhost:5173")
public class GeminiController {
    @Autowired
    private GeminiService geminiService;
    @PostMapping("/generate")
    public String generate(@RequestBody GeminiRequestDTO prompt) {
        return geminiService.chat(prompt);
    }
}
