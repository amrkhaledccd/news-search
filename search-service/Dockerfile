FROM openjdk:15-jdk-slim

LABEL maintainer="amrkhaledccd@hotmail.com"
VOLUME /tmp

EXPOSE 8080

ARG JAR_FILE=target/search-service-0.0.1-SNAPSHOT.jar

ADD ${JAR_FILE} app.jar

ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]