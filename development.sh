# Build and run with Docker Compose
docker-compose -f docker-compose.dev.yml up

# Or build manually
docker build -t task-backend .
docker run -p 5000:5000 --env-file .env task-backend