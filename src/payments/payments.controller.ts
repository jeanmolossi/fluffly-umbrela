import { Body, Controller, Post, Response, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Response as eResponse } from 'express';
import { JwtAuthGuard } from '@/auth/infra/guards/jwt-auth.guard';
import { HttpStatus } from '@/shared/domain/http-status';
import { AuthUser } from '@/shared/infra/decorators/user.decorator';
import { User } from '@/users/domain';
import { AddWallet } from './infra/adapters/add-wallet';
import { CreateWalletService } from './infra/services/create.service';

@Controller('payments')
@ApiTags('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
	constructor(private readonly create: CreateWalletService) {}

	@Post()
	@ApiBody({ type: AddWallet })
	async createPayment(
		@Body() add_wallet: AddWallet,
		@AuthUser() user: User,
		@Response() response: eResponse
	) {
		add_wallet.user_id = user.id;
		const result = await this.create.run(add_wallet);

		return response.status(HttpStatus.CREATED).send(result);
	}
}
