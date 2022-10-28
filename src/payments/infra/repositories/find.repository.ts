import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentMethod } from '@/payments/domain';
import { BaseFilters } from '@/shared/infra/repositories/base.filters';
import { BaseRepository } from '@/shared/infra/repositories/base.repository';
import { arrayModelToDomain } from './payment.mapper';
import { PaymentModel } from './payments.entity';

@Injectable()
export class FindWalletRepository
	extends BaseRepository
	implements Payment.FindRepository
{
	constructor(
		@InjectRepository(PaymentModel)
		private paymentsRepository: Repository<PaymentModel>
	) {
		super();
	}

	async run(
		filter: Partial<Payment.Model>,
		filters: BaseFilters<Payment.Model, Payment.Relations>
	): Promise<{ payments: PaymentMethod[]; total: number }> {
		const where = this.options<PaymentModel>(filter, filters);
		const [payments, total] = await this.paymentsRepository.findAndCount({
			...where,
			cache: {
				id: `payments-${filter.user?.id}`,
				milliseconds: 1000 * 60 * 5 // 5 minutes
			}
		});

		return { payments: arrayModelToDomain(payments), total };
	}
}
