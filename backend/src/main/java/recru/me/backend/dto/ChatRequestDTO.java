package recru.me.backend.dto;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class ChatRequestDTO {
    private List<GeminiRequestDTO.Content> messages;
}