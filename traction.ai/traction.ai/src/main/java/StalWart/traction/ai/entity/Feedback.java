package StalWart.traction.ai.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "feedback",
    uniqueConstraints = {
        // One rating per user per query (mirrors idx_feedback_unique)
        @UniqueConstraint(name = "idx_feedback_unique", columnNames = {"user_id", "query_id"})
    }
)
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "query_id", nullable = false)
    private Query query;

    // 1 = thumbs up, -1 = thumbs down
    @Column(name = "rating", nullable = false, columnDefinition = "SMALLINT")
    private Short rating;

    // Optional free-text feedback
    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    @Column(name = "created_at", nullable = false, updatable = false,
            columnDefinition = "TIMESTAMPTZ DEFAULT NOW()")
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = OffsetDateTime.now();
    }

    // Constructors
    public Feedback() {}

    public Feedback(User user, Query query, Short rating) {
        this.user = user;
        this.query = query;
        this.rating = rating;
    }

    public Feedback(User user, Query query, Short rating, String comment) {
        this.user = user;
        this.query = query;
        this.rating = rating;
        this.comment = comment;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Query getQuery() { return query; }
    public void setQuery(Query query) { this.query = query; }

    public Short getRating() { return rating; }
    public void setRating(Short rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
