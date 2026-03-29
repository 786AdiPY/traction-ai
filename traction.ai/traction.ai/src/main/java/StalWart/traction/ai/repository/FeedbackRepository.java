package StalWart.traction.ai.repository;

import StalWart.traction.ai.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, UUID> {

    // Get a user's rating for a specific query (unique per user+query)
    Optional<Feedback> findByUser_IdAndQuery_Id(UUID userId, UUID queryId);

    // Check if a user has already rated a query
    boolean existsByUser_IdAndQuery_Id(UUID userId, UUID queryId);

    // All feedback left by a user (for profile/history view)
    List<Feedback> findByUser_IdOrderByCreatedAtDesc(UUID userId);

    // All feedback for a specific query (useful for monitoring output quality)
    List<Feedback> findByQuery_Id(UUID queryId);

    // Thumbs up count for a query (rating = 1)
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.query.id = :queryId AND f.rating = 1")
    long countThumbsUpByQuery_Id(@Param("queryId") UUID queryId);

    // Thumbs down count for a query (rating = -1)
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.query.id = :queryId AND f.rating = -1")
    long countThumbsDownByQuery_Id(@Param("queryId") UUID queryId);

    // All negative feedback — useful for prompt improvement analysis
    @Query("SELECT f FROM Feedback f WHERE f.rating = -1 ORDER BY f.createdAt DESC")
    List<Feedback> findAllNegativeFeedback();
}
