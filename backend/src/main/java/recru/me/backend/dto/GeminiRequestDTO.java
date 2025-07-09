package recru.me.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class GeminiRequestDTO {
    private List<Content> contents;
    private Content systemInstruction;

    @Getter
    @Setter
    public static class Content {
        private String role;
        private List<Part> parts;
    }

    @Getter
    @Setter
    public static class Part {
        private String text;

        public Part() {}

        public Part(String text) {
            this.text = text;
        }
    }
}
