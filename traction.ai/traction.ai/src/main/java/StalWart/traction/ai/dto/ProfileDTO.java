package StalWart.traction.ai.dto;

import StalWart.traction.ai.entity.Profile.Category;
import StalWart.traction.ai.entity.Profile.Stage;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.OffsetDateTime;
import java.util.UUID;

public class ProfileDTO {

    private UUID id;

    private UUID userId;

    private String startupName;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Stage is required")
    private Stage stage;

    @NotNull(message = "Category is required")
    private Category category;

    @Positive(message = "Team size must be a positive number")
    private Integer teamSize;

    private Boolean isActive;

    private OffsetDateTime createdAt;

    // Constructors
    public ProfileDTO() {}

    public ProfileDTO(UUID id, UUID userId, String startupName, String description,
                      Stage stage, Category category, Integer teamSize,
                      Boolean isActive, OffsetDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.startupName = startupName;
        this.description = description;
        this.stage = stage;
        this.category = category;
        this.teamSize = teamSize;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getStartupName() { return startupName; }
    public void setStartupName(String startupName) { this.startupName = startupName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Stage getStage() { return stage; }
    public void setStage(Stage stage) { this.stage = stage; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public Integer getTeamSize() { return teamSize; }
    public void setTeamSize(Integer teamSize) { this.teamSize = teamSize; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
