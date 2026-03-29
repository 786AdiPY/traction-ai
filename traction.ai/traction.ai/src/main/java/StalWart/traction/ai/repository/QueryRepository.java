package StalWart.traction.ai.repository;

import StalWart.traction.ai.entity.Query;
import StalWart.traction.ai.entity.Query.Module;
import StalWart.traction.ai.entity.Query.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface QueryRepository extends JpaRepository<Query, UUID> {

    // User's query history for a specific module (uses idx_queries_user_module)
    Page<Query> findByUser_IdAndModuleOrderByCreatedAtDesc(UUID userId, Module module, Pageable pageable);

    // All queries for a user across all modules
    Page<Query> findByUser_IdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    // Cache lookup: find a recent completed query for exact same module + text
    // Uses idx_queries_cache (module, query_text, created_at DESC)
    Optional<Query> findTopByModuleAndQueryTextAndStatusOrderByCreatedAtDesc(
            Module module, String queryText, Status status);

    // Track in-progress queries per user (should be near-empty)
    List<Query> findByUser_IdAndStatusNot(UUID userId, Status status);

    // All non-completed queries globally (admin / monitoring use)
    List<Query> findByStatusNot(Status status);

    // Count how many queries a user has run per module
    long countByUser_IdAndModule(UUID userId, Module module);

    // Fallback queries - where Gemini used training knowledge instead of live scrape
    List<Query> findByUser_IdAndIsFallbackTrue(UUID userId);
}
