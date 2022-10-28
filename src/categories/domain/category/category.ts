import { randomUUID } from 'crypto';
import { Entity } from '@/shared/domain/entity';
import { Transaction } from '@/transactions/domain';
import { User } from '@/users/domain';
import { Categories } from './namespace';

export class Category extends Entity {
	constructor(
		private readonly _props: Categories.Model = {} as Categories.Model
	) {
		_props.id = _props.id ?? randomUUID();

		super(_props.id);
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

	get parent_id(): string {
		return this._props.parent?.id;
	}

	get parent(): Category {
		if (!this._props.parent) return;
		return this._props.parent;
	}

	get sub_categories(): Category[] {
		return this._props.sub_categories;
	}

	get transactions(): Transaction[] {
		return this._props.transactions;
	}

	get created_at(): Date {
		return this._props.created_at;
	}

	get updated_at(): Date {
		return this._props.updated_at;
	}
}
