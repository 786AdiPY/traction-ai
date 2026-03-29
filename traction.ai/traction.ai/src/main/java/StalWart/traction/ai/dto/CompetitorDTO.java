package StalWart.traction.ai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;
import java.util.UUID;

public class CompetitorDTO {

    private UUID id;

    @NotNull(message = "User ID is required")
    private UUID userId;

    @NotNull(message = "Profile ID is required")
    private UUID profileId;

    @NotBlank(message = "Competitor name is required")
    private String name;

    private String websiteUrl;

    private String notes;

    // Cached TinyFish scrape output as raw JSON string
    private String scrapeData;

    private OffsetDateTime lastScrapedAt;

    private OffsetDateTime createdAt;

    // Constructors
    public CompetitorDTO() {}

    public CompetitorDTO(UUID id, UUID userId, UUID profileId, String name,
                         String websiteUrl, String notes, String scrapeData,
                         OffsetDateTime lastScrapedAt, OffsetDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.profileId = profileId;
        this.name = name;
        this.websiteUrl = websiteUrl;
        this.notes = notes;
        this.scrapeData = scrapeData;
        this.lastScrapedAt = lastScrapedAt;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public UUID getProfileId() { return profileId; }
    public void setProfileId(UUID profileId) { this.profileId = profileId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getWebsiteUrl() { return websiteUrl; }
    public void setWebsiteUrl(String websiteUrl) { this.websiteUrl = websiteUrl; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getScrapeData() { return scrapeData; }
    public void setScrapeData(String scrapeData) { this.scrapeData = scrapeData; }

    public OffsetDateTime getLastScrapedAt() { return lastScrapedAt; }
    public void setLastScrapedAt(OffsetDateTime lastScrapedAt) { this.lastScrapedAt = lastScrapedAt; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
