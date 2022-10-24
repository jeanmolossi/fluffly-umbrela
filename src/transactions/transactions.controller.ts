import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/infra/guards/jwt-auth.guard';
import { AuthUser } from '@/shared/infra/decorators/user.decorator';
import { User } from '@/users/domain';
import { AddTransaction } from './infra/adapters/add-transaction';
import { TransactionDTO } from './infra/dto/transaction.dto';
import { AddTransactionService } from './infra/services/add-transaction.service';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
@ApiTags('transactions')
export class TransactionsController {
	constructor(
		private readonly addTransactionService: AddTransactionService
	) {}

	@Post()
	@ApiBody({ type: AddTransaction })
	@ApiCreatedResponse({ type: TransactionDTO })
	async createTransaction(
		@AuthUser() user: User,
		@Body() add_transaction: AddTransaction
	) {
		add_transaction.user_id = user.id;

		return this.addTransactionService.run(add_transaction);
	}
}
