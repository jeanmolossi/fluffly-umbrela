import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { plainToClass } from 'class-transformer';
import { Categories } from '@/categories/domain';
import { FindOneCategoryRepository } from '@/categories/infra/repositories/find-one.repository';
import { Payment } from '@/payments/domain';
import { FindOneWalletRepository } from '@/payments/infra/repositories/find-one.repository';
import { BadRequestErr, ConflictErr } from '@/shared/domain/http-errors';
import { Transactions } from '@/transactions/domain/transaction/namespace';
import { AddTransaction } from '../adapters/add-transaction';
import { TransactionDTO } from '../dto/transaction.dto';
import { TransactionAddedEvent } from '../events/transaction-added.event';
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
		private readonly findCategory: Categories.FindOneRepository,
		// Event emitter
		private readonly emitter: EventEmitter2
	) {}

	async run(add_transaction: AddTransaction): Promise<TransactionDTO> {
		const {
			user_id,
			reference,
			value,
			category_id,
			wallet_id,
			type = Transactions.Type.EXPENSE
		} = add_transaction;

		const aggregations_exists = await this.aggregations_exists(
			add_transaction
		);

		if (!aggregations_exists) {
			throw new BadRequestErr(
				'Wallet or category selected does not exists'
			);
		}

		const transaction_already_exists = await this.findOne.run({
			user: { id: user_id },
			reference,
			value,
			created_at: new Date()
		});

		if (transaction_already_exists) {
			throw new ConflictErr('Transaction already exists');
		}

		const transaction_added_event = new TransactionAddedEvent();
		transaction_added_event.value = add_transaction.value;

		this.emitter.emit('transaction.added', transaction_added_event);

		return plainToClass(
			TransactionDTO,
			await this.create.run({
				reference,
				value,
				type,
				user: { id: user_id },
				category: { id: category_id },
				wallet: { id: wallet_id }
			})
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
