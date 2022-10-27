import { randomUUID } from 'crypto';
import { Entity } from '@/shared/domain/entity';
import { User } from '@/users/domain';
import { Accounts } from './namespace';

export class Account extends Entity {
	constructor(
		private readonly _props: Accounts.Model = {} as Accounts.Model
	) {
		_props.id = _props.id ?? randomUUID();
		super(_props.id);

		// Initialize all optional props
		_props.initial_amount = _props.initial_amount ?? 0;
		_props.current_amount = _props.current_amount ?? 0;
		_props.bank_id = _props.bank_id ?? 1;
		_props.bank_name = _props.bank_name ?? 'Carteira';
		_props.created_at = _props.created_at ?? new Date();
		_props.updated_at = _props.updated_at ?? new Date();
	}

	get user_id(): string {
		return this._props.user?.id;
	}

	get user(): User {
		return this._props.user;
	}

	get name(): string {
		return this._props.name;
	}

	get initial_amount(): number {
		return this._props.initial_amount;
	}

	get current_amount(): number {
		return this._props.current_amount;
	}

	get bank_id(): number {
		return this._props.bank_id;
	}

	get bank_name(): string {
		return this._props.bank_name;
	}

	get created_at(): Date {
		return this._props.created_at;
	}

	get updated_at(): Date {
		return this._props.updated_at;
	}

	public updateInitialAmount(newAmount: number) {
		if (!Number.isInteger(newAmount)) {
			throw new Error('Amount should be integer (cents value)');
		}

		if (!Number.isSafeInteger(newAmount)) {
			throw new Error('Invalid amount');
		}

		this._props.initial_amount = newAmount;
	}
}
