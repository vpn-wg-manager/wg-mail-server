db_up:
	docker compose -f db.compose.yml up -d

db_down:
	docker compose -f db.compose.yml down

full_restart:
	docker compose down && docker image rm server-api && docker system prune -f && sudo rm -rf mongo-volume && docker compose up -d
