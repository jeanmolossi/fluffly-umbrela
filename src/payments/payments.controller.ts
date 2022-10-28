import {
	Body,
	Controller,
	Get,
	Post,
	Query,
	Response,
	UseGuards
} from '@nestjs/common';
import { ApiBasicAuth, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response as eResponse } from 'express';
import { JwtAuthGuard } from '@/auth/infra/guards/jwt-auth.guard';
import { HttpStatus } from '@/shared/domain/http-status';
import { Pagination } from '@/shared/infra/adapters/pagination';
import { AuthUser } from '@/shared/infra/decorators/user.decorator';
import constants from '@/shared/shared.constants';
import { User } from '@/users/domain';
import { Payment } from './domain';
import { AddWallet } from './infra/adapters/add-wallet';
import { PaymentListDTO } from './infra/dto/payment-list.dto';
import { CreateWalletService } from './infra/services/create.service';
import { FindMyWalletsService } from './infra/services/find.service';

@Controller('payments')
@ApiTags('payments')
@UseGuards(JwtAuthGuard)
@ApiBasicAuth(constants.AUTH_TOKEN)
export class PaymentsController {
	constructor(
		private readonly create: CreateWalletService,
		private readonly find: FindMyWalletsService
	) {}

	@Post()
	@ApiBody({ type: AddWallet })
	async createPayment(
		@Body() add_wallet: AddWallet,
		@AuthUser() user: User,
		@Response() response: eResponse
	) {
		add_wallet.user_id = user.id;
		const result = await this.create.run(add_wallet);

		return response.status(HttpStatus.CREATED).json(result);
	}

	@Get()
	@ApiOkResponse({ type: PaymentListDTO })
	async getMyPayments(
		@AuthUser() user: User,
		@Response() response: eResponse,
		@Query() filters: Pagination<Payment.Model, Payment.Relations>
	) {
		const result = await this.find.run(user, filters);

		return response.json(result);
	}
}
