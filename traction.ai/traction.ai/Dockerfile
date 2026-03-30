# Traction.ai Spring Boot API — Java 21
# Build context: this folder (pom.xml + src + Dockerfile).
#
# Inject secrets at runtime (-e, Render, Railway, K8s). Do not commit real keys into the image.

FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /build

COPY pom.xml .
COPY src ./src
RUN mvn -q -e -B -DskipTests package \
	&& JAR=$(ls target/traction.ai-*.jar | head -1) \
	&& cp "$JAR" /build/app.jar

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

RUN groupadd --system --gid 1001 spring \
	&& useradd --system --uid 1001 --gid spring --home /app --shell /usr/sbin/nologin spring \
	&& chown spring:spring /app

COPY --from=build --chown=spring:spring /build/app.jar /app/app.jar

USER spring:spring
EXPOSE 8080

ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

# Safe default only (matches application.properties). Override at deploy time if needed.
ENV JWT_EXPIRATION=86400

# ── Environment variables ↔ application.properties (Spring Boot relaxed binding) ──
#
# Database (same names as in application.properties):
#   DB_URL                  -> spring.datasource.url
#   DB_USER                 -> spring.datasource.username
#   DB_PASS                 -> spring.datasource.password
#   DB_DRIVER_CLASS_NAME    -> spring.datasource.driver-class-name (default: org.postgresql.Driver)
#
# OpenRouter LLM:
#   OPENROUTER_API_KEY   -> openrouter.api.key   (also accepts OPENROUTER_API_KEY in @Value)
#   MODEL                -> model                (e.g. stepfun/step-3.5-flash:free)
#
# TinyFish proxy:
#   TINYFISH_API_KEY     -> tinyfish.api.key     (legacy alt: tiny_fish in properties)
#
# JWT (jwt.secret has no default in code — set in env or bundled application.properties):
#   JWT_SECRET           -> jwt.secret
#   JWT_EXPIRATION       -> jwt.expiration       (seconds; see ENV default above)
#
# Optional TinyFish HTTP timeouts (override application.properties):
#   TINYFISH_HTTP_CONNECT_TIMEOUT_SECONDS
#   TINYFISH_HTTP_READ_TIMEOUT_SECONDS
#
# HTTP port (Render etc. set PORT):
#   PORT                 -> used below as server.port

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar --server.port=${PORT:-8080}"]
