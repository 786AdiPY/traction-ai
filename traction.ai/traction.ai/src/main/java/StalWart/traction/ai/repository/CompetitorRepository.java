package StalWart.traction.ai.repository;

import StalWart.traction.ai.entity.Competitor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CompetitorRepository extends JpaRepository<Competitor, UUID> {

    // All competitors in a user's watchlist for a specific profile (uses idx_comp_user)
    List<Competitor> findByUser_IdAndProfile_Id(UUID userId, UUID profileId);

    // All competitors for a user across all profiles
    List<Competitor> findByUser_Id(UUID userId);

    // Case-insensitive name lookup — mirrors the LOWER(name) functional unique index
    // Used to enforce uniqueness before insert and for PriceLab/HireSignal lookups
    @Query("SELECT c FROM Competitor c WHERE c.user.id = :userId AND LOWER(c.name) = LOWER(:name)")
    Optional<Competitor> findByUser_IdAndNameIgnoreCase(@Param("userId") UUID userId,
                                                        @Param("name") String name);

    // Check if a competitor already exists for this user (case-insensitive)
    @Query("SELECT COUNT(c) > 0 FROM Competitor c WHERE c.user.id = :userId AND LOWER(c.name) = LOWER(:name)")
    boolean existsByUser_IdAndNameIgnoreCase(@Param("userId") UUID userId,
                                             @Param("name") String name);

    // Competitors that have never been scraped or are stale — for background refresh scheduling
    @Query("SELECT c FROM Competitor c WHERE c.user.id = :userId AND c.lastScrapedAt IS NULL")
    List<Competitor> findUnscrapedByUser_Id(@Param("userId") UUID userId);

    // Count of tracked competitors per user per profile
    long countByUser_IdAndProfile_Id(UUID userId, UUID profileId);
}
