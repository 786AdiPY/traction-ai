package StalWart.traction.ai.controller;

import java.net.http.HttpClient;
import java.time.Duration;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

@RestController
@RequestMapping("/v1/automation")
public class TinyFishProxyController {

	private static final String TF_BASE = "https://agent.tinyfish.ai";

	private final RestClient client;
	private final String apiKey;

	public TinyFishProxyController(
			@Value("${tinyfish.api.key:${tiny_fish:}}") String apiKey,
			@Value("${tinyfish.http.connect-timeout-seconds:45}") int connectTimeoutSeconds,
			@Value("${tinyfish.http.read-timeout-seconds:180}") int readTimeoutSeconds) {
		this.apiKey = apiKey != null ? apiKey : "";
		HttpClient httpClient = HttpClient.newBuilder()
				.connectTimeout(Duration.ofSeconds(Math.max(5, connectTimeoutSeconds)))
				.build();
		JdkClientHttpRequestFactory rf = new JdkClientHttpRequestFactory(httpClient);
		rf.setReadTimeout(Duration.ofSeconds(Math.max(30, readTimeoutSeconds)));
		this.client = RestClient.builder()
				.baseUrl(TF_BASE)
				.requestFactory(rf)
				.build();
	}

	@PostMapping(value = "/run-sse", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	public ResponseEntity<String> runSse(@RequestBody Map<String, Object> body) {
		if (apiKey.isBlank()) {
			return ResponseEntity.status(503)
					.contentType(MediaType.TEXT_EVENT_STREAM)
					.body("data: {\"type\":\"ERROR\",\"message\":\"TinyFish key not configured\"}\n\n");
		}
		try {
			String resp = client.post()
					.uri("/v1/automation/run-sse")
					.header("Content-Type", MediaType.APPLICATION_JSON_VALUE)
					.header("X-API-Key", apiKey)
					.body(body)
					.retrieve()
					.body(String.class);
			return ResponseEntity.ok().contentType(MediaType.TEXT_EVENT_STREAM).body(resp != null ? resp : "");
		}
		catch (RestClientResponseException e) {
			return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
					.contentType(MediaType.TEXT_EVENT_STREAM)
					.body("data: {\"type\":\"ERROR\",\"status\":" + e.getStatusCode().value() + "}\n\n");
		}
		catch (RestClientException e) {
			return ResponseEntity.status(HttpStatus.GATEWAY_TIMEOUT)
					.contentType(MediaType.TEXT_EVENT_STREAM)
					.body("data: {\"type\":\"ERROR\",\"message\":\"TinyFish timeout or network error\"}\n\n");
		}
	}
}
