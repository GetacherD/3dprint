#!/bin/bash
set -a
source .env
set +a

./mvnw clean spring-boot:run
