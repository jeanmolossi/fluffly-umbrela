import { modelToDomain as accountModelToDomain } from '@/accounts/infra/repositories/account.mapper';
import { Payment, CashMethod, CreditCard, DebitCard } from '@/payments/domain';
import { PaymentMethod } from '@/payments/domain/payment/payment-method';
import { PaymentModel } from './payments.entity';

export function modelToDomain(payment: PaymentModel): PaymentMethod {
	if (!payment?.id) return;

	const { type = Payment.Type.CASH } = payment;

	const type_based = {
		[Payment.Type.CASH]: CashMethod,
		[Payment.Type.CREDIT]: CreditCard,
		[Payment.Type.DEBIT]: DebitCard
	} as const;

	const { account, ...rest } = payment;

	return new type_based[type]({
		...rest,
		account: accountModelToDomain(account)
	});
}

export function arrayModelToDomain(payments: PaymentModel[]): PaymentMethod[] {
	return payments?.map(modelToDomain);
}
