import { randomUUID } from 'crypto';
import { Entity } from '@/shared/domain/entity';
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
		if (!this._props.user_id) {
			throw new Error('A transaction should have a user');
		}

		if (!this._props.reference) {
			throw new Error('All transactions should have a reference');
		}

		if (!this._props.category_id) {
			throw new Error('You should provide a transaction category');
		}

		if (!this._props.wallet_id) {
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
		return this._props.wallet_id;
	}

	get category_id(): string {
		return this._props.category_id;
	}

	get user_id(): string {
		return this._props.user_id;
	}

	get type(): Transactions.Type {
		return this._props.type;
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