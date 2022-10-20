import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentMethod } from '@/payments/domain';
import { arrayModelToDomain } from './payment.mapper';
import { PaymentModel } from './payments.entity';

@Injectable()
export class FindWalletRepository implements Payment.FindRepository {
	constructor(
		@InjectRepository(PaymentModel)
		private paymentsRepository: Repository<PaymentModel>
	) {}

	async run(
		filter: Partial<Payment.Model>,
		page: number = 1,
		per_page: number = 15
	): Promise<{ payments: PaymentMethod[]; total: number }> {
		const [payments, total] = await this.paymentsRepository.findAndCount({
			where: filter,
			cache: {
				id: 'payments',
				milliseconds: 1000 * 60
			},
			take: per_page,
			skip: this.offset(page, per_page)
		});

		return { payments: arrayModelToDomain(payments), total };
	}

	private offset(page: number = 1, per_page: number = 15): number {
		return (page - 1) * per_page;
	}
}
