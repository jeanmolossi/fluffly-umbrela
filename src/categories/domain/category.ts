import { randomUUID } from 'crypto';
import { Entity } from '@/shared/domain/entity';

export namespace Category {
	export interface Model {
		id?: string;
		parent_id?: string;
		name: string;
		created_at?: Date;
		updated_at?: Date;
	}
}

export class Category extends Entity {
	constructor(private readonly _props: Category.Model) {
		_props.id = _props.id ?? randomUUID();

		super(_props.id);

		_props.created_at = _props.created_at ?? new Date();
		_props.updated_at = _props.updated_at ?? new Date();
	}

	get name(): string {
		return this._props.name;
	}

	get parent_id(): string {
		return this._props.parent_id;
	}
}
