package StalWart.traction.ai.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

import StalWart.traction.ai.entity.Query;

public record QuerySavedResponse(UUID id, Query.Module module, String queryText, Query.Status status, OffsetDateTime createdAt) {

	public static QuerySavedResponse from(Query q) {
		return new QuerySavedResponse(q.getId(), q.getModule(), q.getQueryText(), q.getStatus(), q.getCreatedAt());
	}
}
