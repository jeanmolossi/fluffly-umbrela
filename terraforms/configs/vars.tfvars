context           = "financial-app"
project_name      = "API-fluffy-umbrela"
repository_source = "https://github.com/jeanmolossi/fluffly-umbrela"
route53_zone_name = "jeanmolossi.com.br"
base_infra		  = "financial-base-infra"

ecs = {
	container_name = "API-fluffy-umbrela"
	container_port = "3000"
	healthcheck_path = "/ping"
}

ecr = {
	max_old_images = 5
}

rds = {
	is_public = true
	backup_retention_days = 1
	storage_type = "gp2"
}
