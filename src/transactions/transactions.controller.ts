import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
	ApiBody,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiTags
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/infra/guards/jwt-auth.guard';
import { Pagination } from '@/shared/infra/adapters/pagination';
import { AuthUser } from '@/shared/infra/decorators/user.decorator';
import { User } from '@/users/domain';
import { AddTransaction } from './infra/adapters/add-transaction';
import { TransactionListDTO } from './infra/dto/transaction-list.dto';
import { TransactionDTO } from './infra/dto/transaction.dto';
import { AddTransactionService } from './infra/services/add-transaction.service';
import { GetMyTransactionsService } from './infra/services/get-my-transactions.service';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
@ApiTags('transactions')
export class TransactionsController {
	constructor(
		private readonly addTransactionService: AddTransactionService,
		private readonly getMyTransactionsService: GetMyTransactionsService
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

	@Get()
	@ApiOkResponse({ type: TransactionListDTO })
	async getMyTransactions(
		@AuthUser() user: User,
		@Query() pagination: Pagination
	) {
		return this.getMyTransactionsService.run(user, pagination);
	}
}
