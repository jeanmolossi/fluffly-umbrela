import { Entity } from "@/shared/domain/entity";
import { randomUUID } from "crypto";

export namespace Planning {
	export interface Model {
		id?: string;
		reference: string;
		limit: number;
		category_filters: string[];
		start_at?: number;
		created_at?: Date;
		updated_at?: Date;
	}
}

export class Planning extends Entity {
	constructor(private readonly _props: Planning.Model) {
		_props.id = _props.id ?? randomUUID()

		super(_props.id);

		_props.category_filters = _props.category_filters ?? []
		_props.start_at = _props.start_at ?? 1
		_props.created_at = _props.created_at ?? new Date()
		_props.updated_at = _props.updated_at ?? new Date()

		this.validate()
	}

	private validate() {
		if (!this._props.reference) {
			throw new Error("A planning should have a reference")
		}

		if (!this._props.limit) {
			throw new Error("A planning should have a budget limit")
		}

		if (!Number.isInteger(this._props.start_at) || !Number.isSafeInteger(this._props.start_at)) {
			throw new Error("The start date from planning should be between 1 - 31")
		}

		if (this._props.category_filters?.length <= 0) {
			throw new Error("The planning should have at least one category as filter")
		}
	}

	get reference(): string {
		return this._props.reference
	}

	get category_filters(): string[] {
		return this._props.category_filters
	}

	get limit(): number {
		return this._props.limit
	}

	get readable_limit(): string {
		// parse int value in cents to BRL
		const toBrl = this._props.limit / 100;
		return new Intl.NumberFormat(
			'pt-BR',
			{ style: 'currency', currency: "BRL" }
		).format(toBrl)
	}

}
