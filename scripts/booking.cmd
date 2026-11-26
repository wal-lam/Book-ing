@echo off
pushd "%~dp0.."

if "%1"=="run" (
    call mvnw.cmd spring-boot:run
) else (
    echo usage: booking run
)

popd
