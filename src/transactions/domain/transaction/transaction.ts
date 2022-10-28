import { randomUUID } from 'crypto';
import { Category } from '@/categories/domain';
import { PaymentMethod } from '@/payments/domain';
import { Entity } from '@/shared/domain/entity';
import { User } from '@/users/domain';
import { Transactions } from './namespace';

export class Transaction extends Entity {
	constructor(
		private readonly _props: Transactions.Model = {} as Transactions.Model
	) {
		_props.id = _props.id ?? randomUUID();

		super(_props.id);

		this.validate();
	}

	private validate() {
		if (Number.isNaN(this._props.value)) {
			throw new Error('Value from transaction should be valid value');
		}

		if (!Number.isSafeInteger(this._props.value || 0)) {
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
		return this._props.type;
	}

	get value(): number {
		return this._props.value;
	}

	get value_fmt(): string {
		if (!this._props.value || Number.isNaN(this._props.value)) {
			return;
		}

		const to_brl = this._props.value / 100;
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		}).format(to_brl);
	}

	get created_at(): Date {
		return this._props.created_at;
	}

	get updated_at(): Date {
		return this._props.updated_at;
	}
}
