usage:
	@echo "Usage:"
	@printf "\t make run \t- Runs application \n"
	@printf "\t make stop \t- Stops application \n"
	@printf "\t make logs \t- Open application logs \n"

.PHONY: run
run:
	./scripts/gen-envs
	docker-compose up -d

.PHONY: stop
stop:
	docker-compose down

.PHONY: logs
logs:
	docker logs -f fluffly_umbrela_api -n 30
