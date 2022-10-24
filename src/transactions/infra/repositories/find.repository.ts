import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '@/transactions/domain';
import { Transactions } from '@/transactions/domain/transaction/namespace';
import { TransactionModel } from './transactions.entity';

@Injectable()
export class FindTransactionRepository implements Transactions.FindRepository {
	constructor(
		@InjectRepository(TransactionModel)
		private readonly transactionsRepository: Repository<TransactionModel>
	) {}

	async run(
		filter: Partial<Transactions.Model>,
		page?: number,
		per_page?: number
	): Promise<Transaction[]> {
		throw new Error('Method not implemented.');
	}
}
