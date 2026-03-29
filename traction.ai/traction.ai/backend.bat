@echo off
title Traction AI — Backend

echo.
echo  ╔══════════════════════════════════════╗
echo  ║      Traction AI Backend             ║
echo  ║      Spring Boot 3.4.3 / Java 21     ║
echo  ╚══════════════════════════════════════╝
echo.

cd /d "%~dp0"

set JAVA_HOME=C:\Java\jdk-21.0.10
set PATH=%JAVA_HOME%\bin;%PATH%

echo  Starting backend on http://localhost:8080
echo  Press Ctrl+C to stop.
echo.

call mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local

pause
