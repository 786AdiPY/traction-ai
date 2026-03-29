# Traction.ai Spring Boot API — deploy on Render as a Web Service (Docker).
# Render: Root Directory = this folder (where pom.xml lives), Dockerfile path = Dockerfile.
# Set env vars in Render: DB_URL, DB_USER, DB_PASS, OPENROUTER_API_KEY, JWT_SECRET,
# TINYFISH_API_KEY (and any other overrides from application.properties).

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

# Render injects PORT; local runs default to 8080.
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar --server.port=${PORT:-8080}"]
