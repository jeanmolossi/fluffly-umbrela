import { randomUUID } from 'crypto';
import { Entity } from '@/shared/domain/entity';
import { Categories } from './namespace';

export class Category extends Entity {
	constructor(private readonly _props: Categories.Model) {
		_props.id = _props.id ?? randomUUID();

		super(_props.id);

		_props.created_at = _props.created_at ?? new Date();
		_props.updated_at = _props.updated_at ?? new Date();
	}

	get user_id(): string {
		return this._props.user_id;
	}

	get name(): string {
		return this._props.name;
	}

	get parent_id(): string {
		return this._props.parent_id;
	}
}
