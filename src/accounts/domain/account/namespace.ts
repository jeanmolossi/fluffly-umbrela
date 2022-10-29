import { PaymentMethod } from '@/payments/domain';
import { BaseFilters } from '@/shared/infra/repositories/base.filters';
import { User } from '@/users/domain';
import { Account } from './account';

export namespace Accounts {
	export type Relations = 'user' | 'wallets';

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
			filters: BaseFilters<Model, Relations>
		): Promise<{ accounts: Account[]; total: number }>;
	}

	export type Updater = (account: Account) => Account;
	export interface UpdateRepository {
		run(account_id: string, cb: Updater): Promise<Account>;
	}
}
