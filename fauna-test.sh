#!/usr/bin/env bash
docker-compose up -d faunadb

echo n | fauna add-endpoint http://localhost:8443/ --alias localhost --key secret
fauna create-database db_name --endpoint=localhost
OUTPUT=$(fauna create-key db_name --endpoint=localhost)

echo "${OUTPUT}"

[[ "${OUTPUT}" =~ secret\:[[:space:]]([A-Za-z0-9_\-]+) ]]

SECRET="${BASH_REMATCH[1]}"
echo "Secret is ${SECRET}"


echo "FAUNA_SECRET=${SECRET}" > ".env.test";

fauna shell --secret="${SECRET}"

CreateCollection({ name: "bookings" })

.exit