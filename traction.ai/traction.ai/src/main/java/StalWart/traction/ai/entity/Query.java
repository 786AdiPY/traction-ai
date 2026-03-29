package StalWart.traction.ai.entity;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "queries", indexes = {
    @Index(name = "idx_queries_user_module", columnList = "user_id, module, created_at DESC"),
    @Index(name = "idx_queries_status",      columnList = "status")
})
public class Query {

    public enum Module {
        opinion, death, compete, hire, investor, reg, price, churn
    }

    public enum Status {
        pending, scraping, analyzing, completed, failed
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;

    @Enumerated(EnumType.STRING)
    @Column(name = "module", nullable = false, length = 50)
    private Module module;

    // What the user typed
    @Column(name = "query_text", nullable = false, columnDefinition = "TEXT")
    private String queryText;

    // Raw TinyFish output: array of results from parallel scrapes
    // e.g., [{"source":"reddit","data":[...]}, ...]
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "scrape_results", columnDefinition = "jsonb")
    private String scrapeResults;

    // Gemini's formatted analysis (markdown-like)
    @Column(name = "analysis_text", columnDefinition = "TEXT")
    private String analysisText;

    // Structured extraction (competitors, risks, prices, etc.)
    // Replaces ALL module-specific snapshot tables
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "analysis_json", columnDefinition = "jsonb")
    private String analysisJson;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private Status status = Status.pending;

    // TRUE if scraping failed and Gemini used training knowledge as fallback
    @Column(name = "is_fallback")
    private Boolean isFallback = false;

    // How many TinyFish calls succeeded
    @Column(name = "scrape_count")
    private Integer scrapeCount = 0;

    // Total time from start to finish (milliseconds)
    @Column(name = "duration_ms")
    private Integer durationMs;

    @Column(name = "created_at", nullable = false, updatable = false,
            columnDefinition = "TIMESTAMPTZ DEFAULT NOW()")
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = OffsetDateTime.now();
        if (this.status == null)    this.status = Status.pending;
        if (this.isFallback == null) this.isFallback = false;
        if (this.scrapeCount == null) this.scrapeCount = 0;
    }

    // Constructors
    public Query() {}

    public Query(User user, Profile profile, Module module, String queryText) {
        this.user = user;
        this.profile = profile;
        this.module = module;
        this.queryText = queryText;
        this.status = Status.pending;
        this.isFallback = false;
        this.scrapeCount = 0;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Profile getProfile() { return profile; }
    public void setProfile(Profile profile) { this.profile = profile; }

    public Module getModule() { return module; }
    public void setModule(Module module) { this.module = module; }

    public String getQueryText() { return queryText; }
    public void setQueryText(String queryText) { this.queryText = queryText; }

    public String getScrapeResults() { return scrapeResults; }
    public void setScrapeResults(String scrapeResults) { this.scrapeResults = scrapeResults; }

    public String getAnalysisText() { return analysisText; }
    public void setAnalysisText(String analysisText) { this.analysisText = analysisText; }

    public String getAnalysisJson() { return analysisJson; }
    public void setAnalysisJson(String analysisJson) { this.analysisJson = analysisJson; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public Boolean getIsFallback() { return isFallback; }
    public void setIsFallback(Boolean isFallback) { this.isFallback = isFallback; }

    public Integer getScrapeCount() { return scrapeCount; }
    public void setScrapeCount(Integer scrapeCount) { this.scrapeCount = scrapeCount; }

    public Integer getDurationMs() { return durationMs; }
    public void setDurationMs(Integer durationMs) { this.durationMs = durationMs; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
