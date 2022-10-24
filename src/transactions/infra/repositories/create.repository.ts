import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '@/transactions/domain';
import { Transactions } from '@/transactions/domain/transaction/namespace';
import { TransactionModel } from './transactions.entity';
import { modelToDomain } from './transactions.mapper';

@Injectable()
export class CreateTransactionRepository
	implements Transactions.CreateRepository
{
	constructor(
		@InjectRepository(TransactionModel)
		private readonly transactionsRepository: Repository<TransactionModel>
	) {}

	async run(transaction: Transactions.Model): Promise<Transaction> {
		const orm_transaction = this.transactionsRepository.create(transaction);
		const saved_transaction = await this.transactionsRepository.save(
			orm_transaction
		);

		return modelToDomain(saved_transaction);
	}
}
