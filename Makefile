.PHONY: help build up down logs migrate makemigrations shell clear static collectstatic test lint

help:
	@echo "=== My Driving Study - Docker Commands ==="
	@echo ""
	@echo "Development:"
	@echo "  make dev            Start all services (dev mode)"
	@echo "  make dev-logs       Tail logs from all services"
	@echo "  make dev-down       Stop dev services"
	@echo ""
	@echo "Production:"
	@echo "  make build          Build all production images"
	@echo "  make up             Start all production services"
	@echo "  make down           Stop all services"
	@echo "  make logs           Tail production logs"
	@echo "  make restart        Restart all services"
	@echo ""
	@echo "Database:"
	@echo "  make migrate        Run Django migrations"
	@echo "  make makemigrations Create new migrations"
	@echo "  make shell          Open Django shell"
	@echo "  make dbrestore      Restore database from backup"
	@echo ""
	@echo "Utils:"
	@echo "  make static         Collect static files"
	@echo "  make test           Run tests"
	@echo "  make lint           Run linters"
	@echo "  make clean          Clean Docker resources"
	@echo "  make certbot        Request SSL certificates"
	@echo ""

# ---- Development ----
dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build

dev-logs:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f

dev-down:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml down

# ---- Production ----
build:
	docker compose build --no-cache

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

restart:
	docker compose down && docker compose up -d

# ---- Database ----
migrate:
	docker compose exec backend python manage.py migrate --noinput

makemigrations:
	docker compose exec backend python manage.py makemigrations

shell:
	docker compose exec backend python manage.py shell

dbrestore:
	@echo "Restoring database from backup..."
	docker compose exec -T db psql -U $$DB_USER -d $$DB_NAME < backup.sql

# ---- Utils ----
static:
	docker compose exec backend python manage.py collectstatic --noinput

test:
	docker compose exec backend python manage.py test

lint:
	docker compose exec backend flake8 apps/
	docker compose exec backend black --check apps/

clean:
	docker compose down -v
	docker system prune -af --volumes

# ---- SSL ----
certbot:
	docker compose run --rm certbot certonly --webroot -w /var/www/certbot \
		-d mystudy.com -d www.mystudy.com \
		--email admin@mystudy.com --agree-tos --no-eff-email
