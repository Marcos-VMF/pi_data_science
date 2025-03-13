FROM postgres:latest

# Set environment variables
ENV POSTGRES_DB=escola
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=admin

# Copy the schema file to the container
COPY init.sql /docker-entrypoint-initdb.d/

# Expose PostgreSQL port
EXPOSE 5432
