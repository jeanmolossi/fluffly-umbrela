import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Payment, PaymentMethod } from '@/payments/domain';
import { get_pages } from '@/shared/helpers/get-pages';
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

	async run(user: User, page?: number, per_page?: number) {
		const { payments, total } = await this.find.run(
			{ user },
			page,
			per_page
		);

		return plainToClass(PaymentListDTO, {
			payments: this.get_payments_dto(payments),
			meta: get_pages('payments', total, { page, per_page })
		});
	}

	private get_payments_dto(payments: PaymentMethod[]): PaymentDTO[] {
		const apply = (payment: PaymentMethod) =>
			plainToClass(PaymentDTO, payment);

		return payments.map(apply);
	}
}
