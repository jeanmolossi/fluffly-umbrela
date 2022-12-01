data "aws_vpc" "this" {
  tags = {
    Name = format("vpc-%s", var.context)
  }
}

data "aws_security_group" "allow_ingress" {
  name = "allow_ingress"

  filter {
    name   = "tag:Name"
    values = ["sg-${var.base_infra}"]
  }
}

data "aws_subnets" "this" {
  filter {
    name   = "tag:Name"
    values = ["subnet-${var.base_infra}"]
  }
}

data "aws_subnet" "this" {
  for_each = toset(data.aws_subnets.this.ids)
  id       = each.value
}
