import { Account } from '@/accounts/domain';
import { BaseFilters } from '@/shared/infra/repositories/base.filters';
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

	export type Relations = 'user' | 'account';

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
			filters: BaseFilters<Model, Relations>
		): Promise<{ payments: PaymentMethod[]; total: number }>;
	}
}
