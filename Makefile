OK_COLOR=\033[32;01m
NO_COLOR=\033[0m
ERROR_COLOR=\033[31;01m
WARN_COLOR=\033[33;01m

usage:
	@echo "Usage:"
	@printf "\t make run \t- Runs application \n"
	@printf "\t make stop \t- Stops application \n"
	@printf "\t make logs \t- Open application logs \n"

.PHONY: run
run:
	@mkdir -p .docker/sessiondbdata/
	@chmod 777 .docker/sessiondbdata/
	@echo -e "$(OK_COLOR)==> Generating env file...$(NO_COLOR)"
	@./scripts/gen-envs
	@echo -e "$(OK_COLOR)==> Starting application...$(NO_COLOR)"
	docker-compose up -d
	@echo -e "$(OK_COLOR)==> Run dynamodb-admin $(NO_COLOR)"

.PHONY: stop
stop:
	@echo -e "$(WARN_COLOR)==> Stoping application. Wait until end...$(NO_COLOR)"
	docker-compose down

.PHONY: logs
logs:
	@echo -e "$(OK_COLOR)==> Connecting to container...$(NO_COLOR)"
	docker logs -f fluffly_umbrela_api -n 30

.PHONY: init
init:
	@echo -e "$(OK_COLOR)==> Initializing infra...$(NO_COLOR)"
	@./terraforms/run.sh init

.PHONY: deploy
deploy:
	@echo -e "$(OK_COLOR)==> Applying infra...$(NO_COLOR)"
	@./terraforms/run.sh plan
	@./terraforms/run.sh apply

.PHONY: destroy
destroy:
	@echo -e "$(OK_COLOR)==> Destroying infra...$(NO_COLOR)"
	@./terraforms/run.sh destroy
