import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '@/transactions/domain';
import { Transactions } from '@/transactions/domain/transaction/namespace';
import { TransactionModel } from './transactions.entity';
import { arrayModelToDomain } from './transactions.mapper';

@Injectable()
export class FindTransactionRepository implements Transactions.FindRepository {
	constructor(
		@InjectRepository(TransactionModel)
		private readonly transactionsRepository: Repository<TransactionModel>
	) {}

	async run(
		filter: Partial<Transactions.Model>,
		filters: Transactions.Filters
	): Promise<{ transactions: Transaction[]; total: number }> {
		const { page, per_page, relations } = filters;

		const [transactions, total] =
			await this.transactionsRepository.findAndCount({
				where: filter,
				take: per_page,
				skip: this.offset(page, per_page),
				relations
			});

		return {
			transactions: arrayModelToDomain(transactions || []),
			total
		};
	}

	private offset(page: number = 1, per_page: number = 15): number {
		return (page - 1) * per_page;
	}
}
