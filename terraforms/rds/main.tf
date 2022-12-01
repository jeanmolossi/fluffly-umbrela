terraform {
  required_version = "~> 1.1.7"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.9.0"
    }
  }

  backend "s3" {
    key     = "financial-app/fluffy-umbrela/rds/terraform.tfstate"
    encrypt = false
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_db_subnet_group" "this" {
  name       = format("db_sn_%s", replace(lower(var.project_name), "-", "_"))
  subnet_ids = [for subnet in data.aws_subnet.this : subnet.id]

  tags = merge(
    local.default_tags,
    { Name = format("rds-subnet-%s", var.project_name) }
  )
}

resource "aws_db_instance" "this" {
  identifier              = format("dbid-%s-%s", lower(var.context), lower(var.project_name))
  db_name                 = format("%s_db", replace(lower(var.project_name), "-", "_"))
  engine                  = "postgres"
  engine_version          = "13.7"
  instance_class          = "db.t4g.micro"
  allocated_storage       = 20
  max_allocated_storage   = 25
  publicly_accessible     = var.rds.is_public
  backup_retention_period = var.rds.backup_retention_days
  storage_type            = var.rds.storage_type
  apply_immediately       = true
  skip_final_snapshot     = true

  username = var.rds_user.username
  password = var.rds_user.password

  vpc_security_group_ids = [data.aws_security_group.allow_ingress.id]
  db_subnet_group_name   = aws_db_subnet_group.this.name

  tags = merge(
    local.default_tags,
    { Name = format("rds-db-%s", var.project_name) }
  )
}
