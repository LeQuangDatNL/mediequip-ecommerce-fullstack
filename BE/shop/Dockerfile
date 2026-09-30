# ===================================================================
# Stage 1: Build source code with Maven
# ===================================================================
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /build

# Sao chép pom.xml và tải dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Sao chép mã nguồn và đóng gói JAR
COPY src ./src
RUN mvn clean package -DskipTests

# ===================================================================
# Stage 2: Runtime Image siêu nhẹ tối ưu cho Render (512MB RAM Free Tier)
# ===================================================================
FROM eclipse-temurin:21-jre-alpine AS runner
WORKDIR /app

# Tạo user spring và cấp quyền sở hữu toàn bộ thư mục /app (bao gồm /app/uploads)
RUN addgroup -S spring && adduser -S spring -G spring && \
    mkdir -p /app/uploads && \
    chown -R spring:spring /app

USER spring:spring

# Sao chép file JAR đã build từ Stage 1
COPY --from=builder --chown=spring:spring /build/target/*.jar app.jar

# Cấu hình JVM tối ưu để ứng dụng chạy mượt mà trong giới hạn 512MB RAM của Render
ENV JAVA_OPTS="-Xms128m -Xmx300m -XX:+UseSerialGC -Djava.security.egd=file:/dev/./urandom"
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT:-8080} -jar app.jar"]
