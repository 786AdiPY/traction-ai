package StalWart.traction.ai.entity;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "competitors", indexes = {
    @Index(name = "idx_comp_user", columnList = "user_id, profile_id")
    // Note: idx_comp_unique_name is a functional unique index on LOWER(name)
    // and cannot be expressed via JPA annotations. It is enforced at the DB level.
})
public class Competitor {

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

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "website_url", columnDefinition = "TEXT")
    private String websiteUrl;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    // Cached: latest features, pricing, team size from TinyFish scrape
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "scrape_data", columnDefinition = "jsonb")
    private String scrapeData;

    @Column(name = "last_scraped_at")
    private OffsetDateTime lastScrapedAt;

    @Column(name = "created_at", nullable = false, updatable = false,
            columnDefinition = "TIMESTAMPTZ DEFAULT NOW()")
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = OffsetDateTime.now();
    }

    // Constructors
    public Competitor() {}

    public Competitor(User user, Profile profile, String name) {
        this.user = user;
        this.profile = profile;
        this.name = name;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Profile getProfile() { return profile; }
    public void setProfile(Profile profile) { this.profile = profile; }

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
