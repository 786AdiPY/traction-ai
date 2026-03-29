package StalWart.traction.ai.llm;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class OpenRouterLlmService {

	private final RestClient client;
	private final String apiKey;
	private final String model;
	private final ObjectMapper objectMapper;

	public OpenRouterLlmService(
			@Value("${OPENROUTER_API_KEY:}") String apiKey,
			@Value("${model:openai/gpt-4o-mini}") String model,
			ObjectMapper objectMapper) {
		this.apiKey = apiKey != null ? apiKey : "";
		this.model = model != null && !model.isBlank() ? model : "openai/gpt-4o-mini";
		this.objectMapper = objectMapper;
		this.client = RestClient.builder().baseUrl("https://openrouter.ai/api/v1").build();
	}

	public boolean isConfigured() {
		return !apiKey.isBlank();
	}

	public String complete(String system, String user, int maxTokens) {
		if (!isConfigured()) {
			throw new IllegalStateException("OPENROUTER_API_KEY is not set");
		}
		String sys = system != null ? system : "";
		String usr = user != null ? user : "";
		Map<String, Object> body = new LinkedHashMap<>();
		body.put("model", model);
		body.put("max_tokens", maxTokens);
		body.put("messages", List.of(
				Map.of("role", "system", "content", sys),
				Map.of("role", "user", "content", usr)));

		String raw;
		try {
			raw = client.post()
					.uri("/chat/completions")
					.header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
					.header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
					.header("HTTP-Referer", "https://traction.ai")
					.header("X-Title", "Traction.ai")
					.body(body)
					.retrieve()
					.body(String.class);
		}
		catch (RestClientResponseException e) {
			String hint = e.getResponseBodyAsString();
			throw new IllegalStateException(
					"OpenRouter error " + e.getStatusCode().value() + (hint != null && !hint.isBlank() ? ": " + hint : ""),
					e);
		}

		if (raw == null || raw.isBlank()) {
			throw new IllegalStateException("Empty response from OpenRouter");
		}
		try {
			JsonNode root = objectMapper.readTree(raw);
			JsonNode content = root.path("choices").path(0).path("message").path("content");
			if (content.isTextual()) {
				return content.asText("");
			}
			if (content.isArray()) {
				StringBuilder sb = new StringBuilder();
				for (JsonNode part : content) {
					if (part.path("type").asText("").equals("text")) {
						sb.append(part.path("text").asText(""));
					}
				}
				return sb.toString();
			}
			return content.toString();
		}
		catch (Exception e) {
			throw new IllegalStateException("Could not parse OpenRouter JSON", e);
		}
	}
}
