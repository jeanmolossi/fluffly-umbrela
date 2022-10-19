import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Payment } from '@/payments/domain';
import {
	CashMethod,
	CreditCard,
	DebitCard,
	PaymentMethod
} from '@/payments/domain/payment/payment-method';
import { ConflictErr } from '@/shared/domain/http-errors';
import { AddWallet } from '../adapters/add-wallet';
import { PaymentDTO } from '../dto/payment.dto';
import { CreateWalletRepository } from '../repositories/create.repository';
import { FindOneWalletRepository } from '../repositories/find-one.repository';

@Injectable()
export class CreateWalletService {
	constructor(
		@Inject(CreateWalletRepository)
		private readonly create: Payment.CreateRepository,
		@Inject(FindOneWalletRepository)
		private readonly findOne: Payment.FindOneRepository
	) {}

	async run(add_wallet: AddWallet) {
		const isset_wallet = await this.findOne.run({
			name: add_wallet.name,
			type: add_wallet.type
		});

		if (isset_wallet) {
			throw new ConflictErr('Wallet already exists');
		}

		const wallet = this.instantiate(add_wallet);

		return plainToClass(PaymentDTO, await this.create.run(wallet));
	}

	private instantiate(add_wallet: AddWallet): PaymentMethod {
		const { type } = add_wallet;

		const type_based = {
			[Payment.Type.CASH]: CashMethod,
			[Payment.Type.CREDIT]: CreditCard,
			[Payment.Type.DEBIT]: DebitCard
		};

		return new type_based[type](add_wallet);
	}
}
