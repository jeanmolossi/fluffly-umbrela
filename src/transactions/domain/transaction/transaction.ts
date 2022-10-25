import { randomUUID } from 'crypto';
import { Category } from '@/categories/domain';
import { PaymentMethod } from '@/payments/domain';
import { Entity } from '@/shared/domain/entity';
import { User } from '@/users/domain';
import { Transactions } from './namespace';

export class Transaction extends Entity {
	constructor(private readonly _props: Transactions.Model) {
		_props.id = _props.id ?? randomUUID();

		super(_props.id);

		// Transaction by default is a expense
		_props.type = _props.type ?? Transactions.Type.EXPENSE;
		_props.created_at = _props.created_at ?? new Date();
		_props.updated_at = _props.updated_at ?? new Date();
		this.validate();
	}

	private validate() {
		if (this._props.user && !this._props.user.id) {
			throw new Error('A transaction should have a user');
		}

		if (!this._props.reference) {
			throw new Error('All transactions should have a reference');
		}

		if (this._props.category && !this._props.category.id) {
			throw new Error('You should provide a transaction category');
		}

		if (this._props.wallet && !this._props.wallet.id) {
			throw new Error('You should provide a wallet from transaction');
		}

		if (!this._props.value || Number.isNaN(this._props.value)) {
			throw new Error('Value from transaction should be valid value');
		}

		if (!Number.isSafeInteger(this._props.value)) {
			throw new Error('Value should be a safe integer');
		}
	}

	get reference(): string {
		return this._props.reference;
	}

	get wallet_id(): string {
		return this._props.wallet?.id;
	}

	get wallet(): PaymentMethod {
		if (!this._props.wallet) return undefined;

		return this._props.wallet as PaymentMethod;
	}

	get category_id(): string {
		return this._props.category?.id;
	}

	get category(): Category {
		return (this._props.category as Category) || undefined;
	}

	get user_id(): string {
		return this._props.user?.id;
	}

	get user(): User {
		return (this._props.user as User) || undefined;
	}

	get type(): Transactions.Type {
		return this._props.type || Transactions.Type.EXPENSE;
	}

	get value(): number {
		return this._props.value;
	}

	get value_fmt(): string {
		if (!this._props.value || Number.isNaN(this._props.value)) {
			return 'R$ 0,00';
		}

		const to_brl = this._props.value / 100;
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		}).format(to_brl);
	}
}
