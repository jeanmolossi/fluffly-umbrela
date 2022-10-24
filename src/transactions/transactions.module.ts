import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from '@/categories/categories.module';
import { PaymentsModule } from '@/payments/payments.module';
import { CreateTransactionRepository } from './infra/repositories/create.repository';
import { FindOneTransactionRepository } from './infra/repositories/find-one.repository';
import { FindTransactionRepository } from './infra/repositories/find.repository';
import { TransactionModel } from './infra/repositories/transactions.entity';
import { AddTransactionService } from './infra/services/add-transaction.service';
import { TransactionsController } from './transactions.controller';

@Module({
	imports: [
		TypeOrmModule.forFeature([TransactionModel]),
		PaymentsModule,
		CategoriesModule
	],
	providers: [
		// Repositories
		CreateTransactionRepository,
		FindOneTransactionRepository,
		FindTransactionRepository,
		// Services
		AddTransactionService
	],
	exports: [TypeOrmModule],
	controllers: [TransactionsController]
})
export class TransactionsModule {}
