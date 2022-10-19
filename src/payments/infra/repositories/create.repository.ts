import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentMethod } from '@/payments/domain';
import { modelToDomain } from './payment.mapper';
import { PaymentModel } from './payments.entity';

@Injectable()
export class CreateWalletRepository implements Payment.CreateRepository {
	constructor(
		@InjectRepository(PaymentModel)
		private readonly paymentsRepository: Repository<PaymentModel>
	) {}

	async run(payment: PaymentMethod): Promise<PaymentMethod> {
		const orm = this.paymentsRepository.create(payment);
		const _payment = await this.paymentsRepository.save(orm);

		return modelToDomain(_payment);
	}
}
