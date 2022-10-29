import { Transactions } from '@/transactions/domain';
import { AddTransaction } from '../adapters/add-transaction';

export class TransactionAddedEvent {
	value: number;
	user_id: string;
	wallet_id: string;
	type: Transactions.Type;

	constructor(readonly add_transaction: AddTransaction) {
		const { value, user_id, wallet_id, type } = add_transaction;

		this.value = value;
		this.user_id = user_id;
		this.wallet_id = wallet_id;
		this.type = type;
	}
}
