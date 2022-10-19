import { randomUUID } from 'crypto';
import { Entity } from '@/shared/domain/entity';

export namespace Transactions {
	export enum Type {
		'EXPENSE' = 'EXPENSE',
		'INCOME' = 'INCOME'
	}

	export interface Model {
		id?: string;
		wallet_id: string;
		category_id: string;
		reference: string;
		type?: Type;
		created_at?: Date;
		updated_at?: Date;
	}
}

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
		if (!this._props.reference) {
			throw new Error('All transactions should have a reference');
		}

		if (!this._props.category_id) {
			throw new Error('You should provide a transaction category');
		}

		if (!this._props.wallet_id) {
			throw new Error('You should provide a wallet from transaction');
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

	get type(): Transactions.Type {
		return this._props.type;
	}
}
