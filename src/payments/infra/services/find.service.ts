import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Payment, PaymentMethod } from '@/payments/domain';
import { get_pages } from '@/shared/helpers/get-pages';
import { User } from '@/users/domain';
import { WalletFilters } from '../adapters/wallet-filters';
import { PaymentListDTO } from '../dto/payment-list.dto';
import { PaymentDTO } from '../dto/payment.dto';
import { FindWalletRepository } from '../repositories/find.repository';

@Injectable()
export class FindMyWalletsService {
	constructor(
		@Inject(FindWalletRepository)
		private readonly find: Payment.FindRepository
	) {}

	async run(user: User, filters: WalletFilters) {
		const where = this.parse_filters(user, filters);

		const { payments, total } = await this.find.run(where, filters);

		return plainToClass(PaymentListDTO, {
			payments: this.get_payments_dto(payments),
			meta: get_pages('payments', total, filters)
		});
	}

	private parse_filters(
		user: User,
		filters: WalletFilters
	): Partial<Payment.Model> {
		const { account: account_id } = filters;

		type Where = Pick<Payment.Model, 'account' | 'user'>;
		const where: Where = { user: { id: user.id } as User };

		if (account_id) {
			const account = { account: { id: account_id } };
			Object.assign(where, account);
		}

		return where;
	}

	private get_payments_dto(payments: PaymentMethod[]): PaymentDTO[] {
		const apply = (payment: PaymentMethod) =>
			plainToClass(PaymentDTO, payment);

		return payments.map(apply);
	}
}
