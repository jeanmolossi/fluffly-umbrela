import { Category } from '@/categories/domain';
import { PaymentMethod } from '@/payments/domain';
import { BaseFilters } from '@/shared/infra/repositories/base.filters';
import { User } from '@/users/domain';
import { Transaction } from './transaction';

export namespace Transactions {
	export enum Type {
		'EXPENSE' = 'EXPENSE',
		'INCOME' = 'INCOME'
	}

	export interface Model {
		id?: string;
		wallet?: Partial<PaymentMethod>;
		category?: Partial<Category>;
		user: Partial<User>;
		reference: string;
		value: number;
		type?: Type;
		created_at?: Date;
		updated_at?: Date;
	}

	export type Relations = 'user' | 'wallet' | 'category';

	export interface Filters extends BaseFilters<Model, Relations> {
		wallet?: string;
		account?: string;
	}

	export interface CreateRepository {
		run(transaction: Model): Promise<Transaction>;
	}

	export interface FindOneRepository {
		run(filter: Partial<Model>): Promise<Transaction>;
	}

	export interface FindRepository {
		run(
			filter: Partial<Model>,
			filters: Filters
		): Promise<{ transactions: Transaction[]; total: number }>;
	}
}
