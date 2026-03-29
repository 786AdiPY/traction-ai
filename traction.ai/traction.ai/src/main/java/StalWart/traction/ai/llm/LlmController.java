package StalWart.traction.ai.llm;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/llm")
public class LlmController {

	private final OpenRouterLlmService openRouterLlmService;

	public LlmController(OpenRouterLlmService openRouterLlmService) {
		this.openRouterLlmService = openRouterLlmService;
	}

	@PostMapping("/chat")
	public ResponseEntity<?> chat(@RequestBody LlmChatRequest req) {
		if (!openRouterLlmService.isConfigured()) {
			return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
					.body(Map.of("error", "OPENROUTER_API_KEY is not set on the server."));
		}
		try {
			int max = req.maxTokens() != null ? Math.min(Math.max(req.maxTokens(), 1), 32000) : 2048;
			String text = openRouterLlmService.complete(req.system(), req.user(), max);
			return ResponseEntity.ok(new LlmChatResponse(text));
		}
		catch (IllegalStateException e) {
			return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(Map.of("error", e.getMessage()));
		}
	}
}
