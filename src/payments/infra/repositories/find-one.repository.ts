import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentMethod } from '@/payments/domain';
import { modelToDomain } from './payment.mapper';
import { PaymentModel } from './payments.entity';

@Injectable()
export class FindOneWalletRepository implements Payment.FindOneRepository {
	constructor(
		@InjectRepository(PaymentModel)
		private paymentsRepository: Repository<PaymentModel>
	) {}

	async run(_payment: Partial<Payment.Model>): Promise<PaymentMethod> {
		const payment = await this.paymentsRepository.findOneBy(_payment);

		if (!payment) return null;

		return modelToDomain(payment);
	}
}
