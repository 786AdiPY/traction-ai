package StalWart.traction.ai.repository;

import StalWart.traction.ai.entity.Profile;
import StalWart.traction.ai.entity.Profile.Category;
import StalWart.traction.ai.entity.Profile.Stage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, UUID> {

    // Get the single active profile for a user (guaranteed unique by DB index)
    Optional<Profile> findByUser_IdAndIsActiveTrue(UUID userId);

    // Get all profiles for a user
    List<Profile> findByUser_Id(UUID userId);

    // Check if a user already has an active profile
    boolean existsByUser_IdAndIsActiveTrue(UUID userId);

    // Find profiles by stage
    List<Profile> findByStage(Stage stage);

    // Find profiles by category
    List<Profile> findByCategory(Category category);
}
