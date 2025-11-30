#!/usr/bin/env sh
# -----------------------------------------------------------------------------
# Gradle start up script for UN*X
# This file was created by the Gradle wrapper.
# It delegates to the 'gradle/wrapper/gradle-wrapper.jar' to download and invoke the specified
# Gradle distribution.
# -----------------------------------------------------------------------------

DEFAULT_JVM_OPTS=""
APP_BASE_NAME="`basename "$0"`"

PRG="$0"

# Resolve symbolic links
while [ -h "$PRG" ] ; do
  ls=`ls -ld "$PRG"`
  link=`expr "$ls" : '.*-> \(.*\)$'`
  if expr "$link" : '/.*' > /dev/null; then
    PRG="$link"
  else
    PRG=`dirname "$PRG"`"/"`expr "$link" : './\(.*\)$'`
  fi
done

PRGDIR=`dirname "$PRG"`
APP_HOME=`cd "$PRGDIR/.." && pwd`

CLASSPATH="$APP_HOME/gradle/wrapper/gradle-wrapper.jar"

if [ ! -f "$CLASSPATH" ]; then
  echo "Gradle wrapper jar not found. Generate it by running 'gradle wrapper' locally or add 'gradle/wrapper/gradle-wrapper.jar' to the repo."
  exit 1
fi

exec java -classpath "$CLASSPATH" org.gradle.wrapper.GradleWrapperMain "$@"
