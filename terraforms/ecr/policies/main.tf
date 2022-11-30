
resource "null_resource" "renew_ecr_token" {
  triggers = {
    token_expired = data.aws_ecr_authorization_token.this.expires_at
  }

  provisioner "local-exec" {
    command = "echo ${data.aws_ecr_authorization_token.this.password} | docker login --username ${data.aws_ecr_authorization_token.this.user_name} --password-stdin ${data.aws_caller_identity.this.account_id}.dkr.ecr.${var.region}.amazonaws.com"
  }
  depends_on = ["module.ecr"]
}

resource "null_resource" "build_and_push" {
  triggers = {
    always_run = timestamp()
  }

  provisioner "local-exec" {
    command = "docker tag ${var.application_name}-${var.environment}:${var.ecr.image_tag} ${data.aws_caller_identity.this.account_id}.dkr.ecr.${var.region}.amazonaws.com/${var.ecr.name}:${var.ecr.image_tag} && docker push ${data.aws_caller_identity.this.account_id}.dkr.ecr.${var.region}.amazonaws.com/${var.ecr.name}:${var.ecr.image_tag}"
  }
  depends_on = ["module.ecr", "null_resource.renew_ecr_token"]
}
