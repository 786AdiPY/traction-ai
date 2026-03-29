package StalWart.traction.ai.llm;

import com.fasterxml.jackson.annotation.JsonProperty;

public record LlmChatRequest(
		String system,
		String user,
		@JsonProperty("max_tokens") Integer maxTokens) {
}
