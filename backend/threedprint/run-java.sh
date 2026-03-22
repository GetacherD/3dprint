#!/bin/bash
set -a
source .env
set +a
java -jar target/threedprint-0.0.1-SNAPSHOT.jar
