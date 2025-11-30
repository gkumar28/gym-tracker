@rem --------------------------------------------------------------------------------
@rem Gradle start up script for Windows
@rem This file was created by the Gradle wrapper.
@rem It delegates to the 'gradle/wrapper/gradle-wrapper.jar' to download and invoke the specified
@rem Gradle distribution.
@rem --------------------------------------------------------------------------------
@echo off
setlocal

set DEFAULT_JVM_OPTS=

set DIRNAME=%~dp0
set APP_BASE_NAME=%~n0
set APP_HOME=
set APP_HOME=%DIRNAME%

if "%APP_HOME%"=="" set APP_HOME=%~dp0

set GRADLE_HOME=
set GRADLE_OPTS=%DEFAULT_JVM_OPTS% %GRADLE_OPTS%

set CLASSPATH=%APP_HOME%gradle\wrapper\gradle-wrapper.jar

if not exist "%CLASSPATH%" (
    echo Gradle wrapper jar not found. Generate it by running 'gradle wrapper' locally or add 'gradle/wrapper/gradle-wrapper.jar' to the repo.
    pause
    exit /b 1
)

java %GRADLE_OPTS% -classpath "%CLASSPATH%" org.gradle.wrapper.GradleWrapperMain %*
