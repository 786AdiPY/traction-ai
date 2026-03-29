package StalWart.traction.ai.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Persisted row lives in table {@code queries} (FK {@code user_id} → {@code users}, {@code profile_id} → {@code profiles}).
 */
public class QuerySaveRequest {

	@NotBlank
	private String module;

	@NotBlank
	private String queryText;

	/** JSON string of TinyFish scrape payloads (array). */
	private String scrapeResults;

	private String analysisText;

	private Boolean isFallback;

	private Integer scrapeCount;

	private Long durationMs;

	/** {@code completed} (default) or {@code failed}. */
	private String status;

	public String getModule() {
		return module;
	}

	public void setModule(String module) {
		this.module = module;
	}

	public String getQueryText() {
		return queryText;
	}

	public void setQueryText(String queryText) {
		this.queryText = queryText;
	}

	public String getScrapeResults() {
		return scrapeResults;
	}

	public void setScrapeResults(String scrapeResults) {
		this.scrapeResults = scrapeResults;
	}

	public String getAnalysisText() {
		return analysisText;
	}

	public void setAnalysisText(String analysisText) {
		this.analysisText = analysisText;
	}

	public Boolean getIsFallback() {
		return isFallback;
	}

	public void setIsFallback(Boolean isFallback) {
		this.isFallback = isFallback;
	}

	public Integer getScrapeCount() {
		return scrapeCount;
	}

	public void setScrapeCount(Integer scrapeCount) {
		this.scrapeCount = scrapeCount;
	}

	public Long getDurationMs() {
		return durationMs;
	}

	public void setDurationMs(Long durationMs) {
		this.durationMs = durationMs;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
}
