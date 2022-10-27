import { PaymentMethod } from '@/payments/domain';
import { User } from '@/users/domain';
import { Account } from './account';

export namespace Accounts {
	export interface Model {
		id?: string;
		user?: User;
		wallets?: PaymentMethod[];
		name: string;
		initial_amount?: number;
		current_amount?: number;
		bank_id?: number;
		bank_name?: string;
		created_at?: Date;
		updated_at?: Date;
	}

	export interface CreateRepository {
		run(account: Account): Promise<Account>;
	}

	export interface FindOneRepository {
		run(filter: Partial<Model>): Promise<Account>;
	}

	export interface FindRepository {
		run(
			filter: Partial<Model>,
			page?: number,
			per_page?: number
		): Promise<{ accounts: Account[]; total: number }>;
	}
}
