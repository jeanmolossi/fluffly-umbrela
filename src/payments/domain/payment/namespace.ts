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
}
