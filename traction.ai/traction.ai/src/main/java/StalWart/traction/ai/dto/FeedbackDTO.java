package StalWart.traction.ai.dto;

import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;
import java.util.UUID;

public class FeedbackDTO {

    private UUID id;

    @NotNull(message = "User ID is required")
    private UUID userId;

    @NotNull(message = "Query ID is required")
    private UUID queryId;

    // 1 = thumbs up, -1 = thumbs down
    @NotNull(message = "Rating is required")
    private Short rating;

    // Optional free-text feedback
    private String comment;

    private OffsetDateTime createdAt;

    // Constructors
    public FeedbackDTO() {}

    public FeedbackDTO(UUID id, UUID userId, UUID queryId,
                       Short rating, String comment, OffsetDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.queryId = queryId;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public UUID getQueryId() { return queryId; }
    public void setQueryId(UUID queryId) { this.queryId = queryId; }

    public Short getRating() { return rating; }
    public void setRating(Short rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
