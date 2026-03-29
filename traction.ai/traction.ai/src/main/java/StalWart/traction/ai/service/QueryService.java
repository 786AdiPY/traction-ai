package StalWart.traction.ai.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import StalWart.traction.ai.dto.QuerySaveRequest;
import StalWart.traction.ai.entity.Profile;
import StalWart.traction.ai.entity.Query;
import StalWart.traction.ai.entity.User;
import StalWart.traction.ai.repository.ProfileRepository;
import StalWart.traction.ai.repository.QueryRepository;
import StalWart.traction.ai.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QueryService {

	private final QueryRepository queryRepository;
	private final UserRepository userRepository;
	private final ProfileRepository profileRepository;

	@Transactional
	public Query saveIntelRun(String userEmail, QuerySaveRequest req) {
		User user = userRepository.findByEmail(userEmail)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
		Profile profile = profileRepository.findByUser_IdAndIsActiveTrue(user.getId())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "No active profile"));

		final Query.Module module;
		try {
			module = Query.Module.valueOf(req.getModule().trim().toLowerCase());
		}
		catch (IllegalArgumentException e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown module: " + req.getModule());
		}

		Query.Status status = Query.Status.completed;
		if (req.getStatus() != null && "failed".equalsIgnoreCase(req.getStatus().trim())) {
			status = Query.Status.failed;
		}

		Query q = new Query();
		q.setUser(user);
		q.setProfile(profile);
		q.setModule(module);
		q.setQueryText(req.getQueryText());
		if (req.getScrapeResults() != null && !req.getScrapeResults().isBlank()) {
			q.setScrapeResults(req.getScrapeResults());
		}
		q.setAnalysisText(req.getAnalysisText());
		q.setStatus(status);
		q.setIsFallback(Boolean.TRUE.equals(req.getIsFallback()));
		q.setScrapeCount(req.getScrapeCount() != null ? req.getScrapeCount() : 0);
		if (req.getDurationMs() != null && req.getDurationMs() <= Integer.MAX_VALUE) {
			q.setDurationMs(req.getDurationMs().intValue());
		}

		return queryRepository.save(q);
	}
}
