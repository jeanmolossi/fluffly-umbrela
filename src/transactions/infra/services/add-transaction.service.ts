import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Categories } from '@/categories/domain';
import { FindOneCategoryRepository } from '@/categories/infra/repositories/find-one.repository';
import { Payment } from '@/payments/domain';
import { FindOneWalletRepository } from '@/payments/infra/repositories/find-one.repository';
import { BadRequestErr, ConflictErr } from '@/shared/domain/http-errors';
import { Transactions } from '@/transactions/domain/transaction/namespace';
import { AddTransaction } from '../adapters/add-transaction';
import { TransactionDTO } from '../dto/transaction.dto';
import { CreateTransactionRepository } from '../repositories/create.repository';
import { FindOneTransactionRepository } from '../repositories/find-one.repository';

@Injectable()
export class AddTransactionService {
	constructor(
		@Inject(FindOneTransactionRepository)
		private readonly findOne: Transactions.FindOneRepository,
		@Inject(CreateTransactionRepository)
		private readonly create: Transactions.CreateRepository,
		// Payments/Wallets - Helpers
		@Inject(FindOneWalletRepository)
		private readonly findWallet: Payment.FindOneRepository,
		// Categories - Helpers
		@Inject(FindOneCategoryRepository)
		private readonly findCategory: Categories.FindOneRepository
	) {}

	async run(add_transaction: AddTransaction): Promise<TransactionDTO> {
		const { user_id, reference, value } = add_transaction;

		const aggregations_exists = await this.aggregations_exists(
			add_transaction
		);

		if (!aggregations_exists) {
			throw new BadRequestErr(
				'Wallet or category selected does not exists'
			);
		}

		const transaction_already_exists = await this.findOne.run({
			user_id,
			reference,
			value,
			created_at: new Date()
		});

		if (transaction_already_exists) {
			throw new ConflictErr('Transaction already exists');
		}

		return plainToClass(
			TransactionDTO,
			await this.create.run(add_transaction)
		);
	}

	private async aggregations_exists({
		wallet_id,
		category_id
	}: AddTransaction) {
		const [has_wallet, has_category] = await Promise.all([
			this.findWallet.run({ id: wallet_id }),
			this.findCategory.run({ id: category_id })
		]);

		return Boolean(has_wallet?.id) && Boolean(has_category?.id);
	}
}
