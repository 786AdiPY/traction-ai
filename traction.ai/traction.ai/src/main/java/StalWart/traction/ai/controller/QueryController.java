package StalWart.traction.ai.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import StalWart.traction.ai.dto.QuerySaveRequest;
import StalWart.traction.ai.dto.QuerySavedResponse;
import StalWart.traction.ai.service.QueryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Intel runs are stored in {@code queries} (linked to {@code users.id} and {@code profiles.id}), not as columns on {@code users}.
 */
@RestController
@RequestMapping("/api/queries")
@RequiredArgsConstructor
public class QueryController {

	private final QueryService queryService;

	@PostMapping
	public ResponseEntity<QuerySavedResponse> save(
			@AuthenticationPrincipal UserDetails userDetails,
			@Valid @RequestBody QuerySaveRequest body) {
		var saved = queryService.saveIntelRun(userDetails.getUsername(), body);
		return ResponseEntity.ok(QuerySavedResponse.from(saved));
	}
}
