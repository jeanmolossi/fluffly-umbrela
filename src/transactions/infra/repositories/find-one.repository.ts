import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '@/transactions/domain';
import { Transactions } from '@/transactions/domain/transaction/namespace';
import { TransactionModel } from './transactions.entity';
import { modelToDomain } from './transactions.mapper';

@Injectable()
export class FindOneTransactionRepository
	implements Transactions.FindOneRepository
{
	constructor(
		@InjectRepository(TransactionModel)
		private readonly transactionsRepository: Repository<TransactionModel>
	) {}

	async run(filter: Partial<Transactions.Model>): Promise<Transaction> {
		const found_transaction = await this.transactionsRepository.findOneBy(
			filter
		);

		if (!found_transaction) return null;

		return modelToDomain(found_transaction);
	}
}
