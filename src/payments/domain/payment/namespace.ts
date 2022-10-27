import { Account } from '@/accounts/domain';
import { User } from '@/users/domain';
import { PaymentMethod } from './payment-method';
export namespace Payment {
	export enum Type {
		'CASH' = 'CASH',
		'DEBIT' = 'DEBIT',
		'CREDIT' = 'CREDIT'
	}

	export enum Brand {
		'VISA' = 'VISA',
		'MASTER' = 'MASTER',
		'ELO' = 'ELO',
		'AMERICAN_EXPRESS' = 'AMERICAN_EXPRESS'
	}

	export interface Model {
		id?: string;
		user?: User;
		account?: Account;
		name: string;
		type?: Type;
		limit?: number;
		brand?: Brand;
		created_at?: Date;
		updated_at?: Date;
	}

	export interface CreateRepository {
		run(payment: PaymentMethod): Promise<PaymentMethod>;
	}

	export interface FindOneRepository {
		run(filter: Partial<Model>): Promise<PaymentMethod>;
	}

	export interface FindRepository {
		run(
			filter: Partial<Model>,
			page?: number,
			per_page?: number
		): Promise<{ payments: PaymentMethod[]; total: number }>;
	}
}
