db_up:
	docker compose -f db.compose.yml up -d

db_down:
	docker compose -f db.compose.yml down
