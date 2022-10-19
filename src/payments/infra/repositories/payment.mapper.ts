import { Payment, CashMethod, CreditCard, DebitCard } from '@/payments/domain';
import { PaymentMethod } from '@/payments/domain/payment/payment-method';
import { PaymentModel } from './payments.entity';

export function modelToDomain(payment: PaymentModel): PaymentMethod {
	const { type } = payment;

	const type_based = {
		[Payment.Type.CASH]: CashMethod,
		[Payment.Type.CREDIT]: CreditCard,
		[Payment.Type.DEBIT]: DebitCard
	};

	return new type_based[type](payment);
}
