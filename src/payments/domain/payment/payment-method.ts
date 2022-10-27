import { randomUUID } from 'crypto';
import { Account } from '@/accounts/domain';
import { Entity } from '@/shared/domain/entity';
import { Payment } from './namespace';

export abstract class PaymentMethod extends Entity {
	/**
	 * PaymentMethod is the base payment method model
	 *
	 * Use that class to create a new payment method
	 * @param {Payment.Model} _props the options to create a payment method
	 */
	constructor(private readonly _props: Payment.Model = {} as Payment.Model) {
		_props.id = _props.id ?? randomUUID();

		super(_props.id);

		// Initialize all optional props
		_props.type = _props.type ?? Payment.Type.CASH;
		_props.limit = _props.limit ?? null;
		_props.brand = _props.brand ?? null;
		_props.created_at = _props.created_at ?? new Date();
		_props.updated_at = _props.updated_at ?? new Date();
	}

	get user_id(): string {
		return this._props.user?.id;
	}

	get account_id(): string {
		return this._props.account?.id;
	}

	get account(): Account {
		return this._props.account;
	}

	get name(): string {
		return this._props.name;
	}

	get type(): Payment.Type {
		return this._props.type;
	}

	get limit(): number {
		return this._props.limit;
	}

	get readable_limit(): string {
		if (!this._props.limit) return null;

		// parse cents to brl
		const to_brl = this._props.limit / 100;
		return new Intl.NumberFormat('pt-BR', {
			currency: 'BRL',
			style: 'currency'
		}).format(to_brl);
	}

	get brand(): Payment.Brand {
		return this._props.brand;
	}

	get created_at(): Date {
		return this._props.created_at;
	}

	get updated_at(): Date {
		return this._props.updated_at;
	}

	/**
	 * factory is the abstract method who will return the payment instance
	 * @param {Payment.Model} _props is the model to instantiate a new payment method
	 */
	public abstract factory(_props: Payment.Model): PaymentMethod;
}

export class CashMethod extends PaymentMethod {
	/**
	 * CashMethod will use PaymentMethod to create payment method Cash
	 *
	 * Use that class to create a new payment method
	 * @param {Payment.Model} _props the options to create a payment method
	 */
	constructor(_props: Payment.Model = {} as Payment.Model) {
		_props.type = _props.type ?? Payment.Type.CASH;
		_props.limit = null;
		_props.brand = null;

		super(_props);
	}

	public factory(_props: Payment.Model): PaymentMethod {
		return new CashMethod(_props);
	}
}

export class CreditCard extends PaymentMethod {
	/**
	 * CreditCard will use PaymentMethod to create payment method Credit Card
	 *
	 * Use that class to create a new payment method
	 * @param {Payment.Model} _props the options to create a payment method
	 */
	constructor(_props: Payment.Model = {} as Payment.Model) {
		// Credit card ever will have CREDIT type
		_props.type = Payment.Type.CREDIT;

		// When no limit or limit less than or equal zero
		// it is invalid credit card
		if (_props.limit <= 0 || !_props.limit) {
			throw new Error('Credit cards should have limit');
		}

		// When credit card has no brand it is invalid credit card
		if (!_props.brand) {
			throw new Error('Credit cards should have a brand');
		}

		super(_props);
	}

	public factory(_props: Payment.Model): PaymentMethod {
		return new CreditCard(_props);
	}
}

export class DebitCard extends PaymentMethod {
	/**
	 * DebitCard will use PaymentMethod to create payment method Debit Card
	 *
	 * Use that class to create a new payment method
	 * @param {Payment.Model} _props the options to create a payment method
	 */
	constructor(_props: Payment.Model = {} as Payment.Model) {
		// Debit card ever will has type DEBIT and no limit
		_props.type = Payment.Type.DEBIT;
		_props.limit = null;

		// When credit card has no brand it is invalid credit card
		if (!_props.brand) {
			throw new Error('Debit cards should have a brand');
		}

		super(_props);
	}

	public factory(_props: Payment.Model): PaymentMethod {
		return new DebitCard(_props);
	}
}
