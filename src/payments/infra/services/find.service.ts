import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Payment, PaymentMethod } from '@/payments/domain';
import { get_pages } from '@/shared/helpers/get-pages';
import { Pagination } from '@/shared/infra/adapters/pagination';
import { User } from '@/users/domain';
import { PaymentListDTO } from '../dto/payment-list.dto';
import { PaymentDTO } from '../dto/payment.dto';
import { FindWalletRepository } from '../repositories/find.repository';

@Injectable()
export class FindMyWalletsService {
	constructor(
		@Inject(FindWalletRepository)
		private readonly find: Payment.FindRepository
	) {}

	async run(
		user: User,
		filters: Pagination<Payment.Model, Payment.Relations>
	) {
		const { payments, total } = await this.find.run(
			{ user: { id: user.id } as User },
			filters
		);

		return plainToClass(PaymentListDTO, {
			payments: this.get_payments_dto(payments),
			meta: get_pages('payments', total, filters)
		});
	}

	private get_payments_dto(payments: PaymentMethod[]): PaymentDTO[] {
		const apply = (payment: PaymentMethod) =>
			plainToClass(PaymentDTO, payment);

		return payments.map(apply);
	}
}
