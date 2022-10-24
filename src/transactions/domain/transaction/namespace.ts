import { Transaction } from './transaction';

export namespace Transactions {
	export enum Type {
		'EXPENSE' = 'EXPENSE',
		'INCOME' = 'INCOME'
	}

	export interface Model {
		id?: string;
		wallet_id: string;
		category_id: string;
		user_id: string;
		reference: string;
		value: number;
		type?: Type;
		created_at?: Date;
		updated_at?: Date;
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
			page?: number,
			per_page?: number
		): Promise<Transaction[]>;
	}
}
