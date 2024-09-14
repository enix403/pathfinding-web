#!/usr/bin/env bash

CONTAINER_NAME=herbimed_pg

docker image pull postgres:latest
docker run --rm -it --name my_pg_container -v ./postgres-data:/var/lib/postgresql/data -p 5432:5432 -e POSTGRES_USER=myuser -e POSTGRES_PASSWORD=mypass -e POSTGRES_DB=mydb postgres:latest

sudo usermod -aG docker $USER

uske bad apna computer restart krein and then uske bad ye command

sudo systemctl enable --now docker


postgres@sha256:a5e89e5f2679863bedef929c4a7ec5d1a2cb3c045f13b47680d86f8701144ed7


docker image inspect jaegertracing/jaeger-agent:latest | jq -r '.[].RepoDigests[]' | awk -F@ '{print $2}'



curl -s 'https://hub.docker.com/v2/repositories/postgres/tags' -H 'Content-Type: application/json' | jq -r '.results[] | select(.digest == "'$dig'") | .name'
