import { randomUUID } from 'crypto';
import { Account } from '@/accounts/domain';
import { Entity } from '@/shared/domain/entity';
import { User } from '@/users/domain';
import { Payment } from './namespace';

export class PaymentFactory {
	static make(payment: Payment.Model): PaymentMethod {
		const { type = Payment.Type.CASH } = payment;

		const type_based = {
			[Payment.Type.CASH]: CashMethod,
			[Payment.Type.CREDIT]: CreditCard,
			[Payment.Type.DEBIT]: DebitCard
		} as const;

		const { account, user, ...rest } = payment;

		return new type_based[type]().factory({ ...rest, user, account });
	}
}

export abstract class PaymentMethod extends Entity {
	/**
	 * PaymentMethod is the base payment method model
	 *
	 * Use that class to create a new payment method
	 * @param {Payment.Model} _props the options to create a payment method
	 */
	constructor(
		protected readonly _props: Payment.Model = {} as Payment.Model
	) {
		_props.id = _props.id ?? randomUUID();

		super(_props.id);

		_props.created_at = _props.created_at ?? new Date();
		_props.updated_at = _props.updated_at ?? new Date();
	}

	get user_id(): string {
		return this._props.user?.id;
	}

	get user(): User {
		return this._props.user;
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
		if (!this._props.limit) return;

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
		super(_props);
	}

	public factory(_props: Payment.Model): PaymentMethod {
		return new DebitCard(_props);
	}
}
