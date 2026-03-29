package StalWart.traction.ai.dto;

import StalWart.traction.ai.entity.Query.Module;
import StalWart.traction.ai.entity.Query.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;
import java.util.UUID;

public class QueryDTO {

    private UUID id;

    @NotNull(message = "User ID is required")
    private UUID userId;

    @NotNull(message = "Profile ID is required")
    private UUID profileId;

    @NotNull(message = "Module is required")
    private Module module;

    @NotBlank(message = "Query text is required")
    private String queryText;

    // Raw TinyFish JSONB output (serialized JSON string)
    private String scrapeResults;

    // Gemini's formatted analysis (markdown-like)
    private String analysisText;

    // Structured Gemini extraction as JSON string
    private String analysisJson;

    private Status status;

    private Boolean isFallback;

    private Integer scrapeCount;

    private Integer durationMs;

    private OffsetDateTime createdAt;

    // Constructors
    public QueryDTO() {}

    public QueryDTO(UUID id, UUID userId, UUID profileId, Module module, String queryText,
                    String scrapeResults, String analysisText, String analysisJson,
                    Status status, Boolean isFallback, Integer scrapeCount,
                    Integer durationMs, OffsetDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.profileId = profileId;
        this.module = module;
        this.queryText = queryText;
        this.scrapeResults = scrapeResults;
        this.analysisText = analysisText;
        this.analysisJson = analysisJson;
        this.status = status;
        this.isFallback = isFallback;
        this.scrapeCount = scrapeCount;
        this.durationMs = durationMs;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public UUID getProfileId() { return profileId; }
    public void setProfileId(UUID profileId) { this.profileId = profileId; }

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
