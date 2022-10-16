import { Entity } from "@/shared/domain/entity";
import { randomUUID } from "crypto";

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
		id?: string
		name: string;
		type?: Type;
		limit?: number;
		brand?: Brand;
		created_at?: Date;
		updated_at?: Date;
	}
}


class PaymentMethod extends Entity {

	/**
	 * PaymentMethod is the base payment method model
	 *
	 * Use that class to create a new payment method
	 * @param {Payment.Model} _props the options to create a payment method
	 */
	constructor(private readonly _props: Payment.Model) {
		_props.id = _props.id ?? randomUUID();

		super(_props.id)

		// Initialize all optional props
		_props.type = _props.type ?? Payment.Type.CASH
		_props.limit = _props.limit ?? null
		_props.brand = _props.brand ?? null
		_props.created_at = _props.created_at ?? new Date()
		_props.updated_at = _props.updated_at ?? new Date()
	}

	get type(): Payment.Type {
		return this._props.type
	}

	get limit(): number {
		return this._props.limit
	}

	get readable_limit(): string {
		if (!this.limit) return null

		// parse cents to brl
		const toBrl = this.limit / 100
		return new Intl.NumberFormat(
			'pt-BR',
			{ currency: 'BRL', style: 'currency' }
		).format(toBrl)
	}

	get brand() : Payment.Brand {
		return this._props.brand
	}
}

export class CashMethod extends PaymentMethod {

	/**
	 * CashMethod will use PaymentMethod to create payment method Cash
	 *
	 * Use that class to create a new payment method
	 * @param {Payment.Model} _props the options to create a payment method
	 */
	constructor(_props: Payment.Model) {
		_props.type = _props.type ?? Payment.Type.CASH
		_props.limit = null
		_props.brand = null

		super(_props)
	}
}

export class CreditCard extends PaymentMethod {

	/**
	 * CreditCard will use PaymentMethod to create payment method Credit Card
	 *
	 * Use that class to create a new payment method
	 * @param {Payment.Model} _props the options to create a payment method
	 */
	constructor(_props: Payment.Model) {
		// Credit card ever will have CREDIT type
		_props.type = Payment.Type.CREDIT

		// When no limit or limit less than or equal zero
		// it is invalid credit card
		if (_props.limit <= 0 || !_props.limit) {
			throw new Error("Credit cards should have limit")
		}

		// When credit card has no brand it is invalid credit card
		if (!_props.brand) {
			throw new Error("Credit cards should have a brand")
		}

		super(_props)
	}
}

export class DebitCard extends PaymentMethod {

	/**
	 * DebitCard will use PaymentMethod to create payment method Debit Card
	 *
	 * Use that class to create a new payment method
	 * @param {Payment.Model} _props the options to create a payment method
	 */
	constructor(_props: Payment.Model) {
		// Debit card ever will has type DEBIT and no limit
		_props.type = Payment.Type.DEBIT
		_props.limit = null

		// When credit card has no brand it is invalid credit card
		if (!_props.brand) {
			throw new Error("Debit cards should have a brand")
		}

		super(_props)
	}
}
