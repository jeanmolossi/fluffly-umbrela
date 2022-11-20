import { Account, Accounts } from '@/accounts/domain';
import { PaymentMethod } from '@/payments/domain';
import { NotFoundErr } from '@/shared/domain/http-errors';
import { Transaction } from '@/transactions/domain';
import { TransactionAddedEvent } from '@/transactions/infra/events/transaction-added.event';
import { User } from '@/users/domain';
import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { FindAccountRepository } from '../repositories/find.repository';
import { UpdateAccountRepository } from '../repositories/update.repository';

@Injectable()
export class TransactionAddedListener {
	constructor(
		@Inject(FindAccountRepository)
		private readonly findAccounts: Accounts.FindRepository,
		@Inject(UpdateAccountRepository)
		private readonly updateAccount: Accounts.UpdateRepository
	) {}

	@OnEvent('transaction.added')
	async handleTransactionAddedEvent(event: TransactionAddedEvent) {
		const { user_id, wallet_id } = event;

		const { accounts } = await this.findAccounts.run(
			{
				user: { id: user_id } as User,
				wallets: { id: wallet_id } as any,
			},
			// @ts-ignore
			{ relations: ['wallets', 'wallets.account'] }
		);

		const wallet = this.get_wallet(wallet_id).on(accounts);

		if (!wallet) throw new NotFoundErr('Invalid wallet provided');

		const { account } = wallet

		if (!account)
			throw new NotFoundErr('No account for this wallet')

		await this.updateAccount.run(wallet.account.id, this.update(event));
	}

	private update(event: TransactionAddedEvent): Accounts.Updater {
		return (account: Account): Account => {
			const { type, value, user_id } = event;

			account.registerTransaction(
				new Transaction({
					type,
					value,
					reference: 'event-transaction',
					user: { id: user_id }
				})
			);

			return account;
		};
	}

	private get_wallet(wallet_id: string) {
		return {
			on(accounts: Account[]): PaymentMethod {
				const wallets = accounts.reduce<PaymentMethod[]>(
					(acc, account) => {
						if (account.wallets.length > 0)
							acc.push(...account.wallets);

						return acc;
					},
					[]
				);

				return wallets.find(w => w.id === wallet_id);
			}
		};
	}
}
