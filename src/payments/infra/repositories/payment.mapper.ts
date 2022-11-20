import { AccountMapper } from '@/accounts/infra/repositories/account.mapper';
import { Payment, CashMethod, CreditCard, DebitCard } from '@/payments/domain';
import { PaymentMethod } from '@/payments/domain/payment/payment-method';
import { UserMapper } from '@/users/infra/repository/user.mapper';
import { PaymentModel } from './payments.entity';

export class PaymentMapper {
	static modelToDomain(payment: PaymentModel): PaymentMethod {
		if (!payment?.id) return;

		const { type = Payment.Type.CASH } = payment;

		const type_based = {
			[Payment.Type.CASH]: CashMethod,
			[Payment.Type.CREDIT]: CreditCard,
			[Payment.Type.DEBIT]: DebitCard
		} as const;

		const { account, user, ...rest } = payment;

		return new type_based[type]({
			...rest,
			user: UserMapper.modelToDomain(user),
			account: AccountMapper.modelToDomain(account)
		});
	}

	static arrayModelToDomain(payments: PaymentModel[]): PaymentMethod[] {
		return payments?.map(this.modelToDomain);
	}

	static domainToModel(payment: PaymentMethod): PaymentModel {
		const to_props: PaymentModel = {
			id: payment.id,
			name: payment.name,
			brand: payment.brand,
			limit: payment.limit,
			type: payment.type,
			user: payment.user,
			account: payment.account as any
		};

		return Object.assign(new PaymentModel(), to_props);
	}
}
