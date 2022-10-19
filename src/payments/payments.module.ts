import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateWalletRepository } from './infra/repositories/create.repository';
import { FindOneWalletRepository } from './infra/repositories/find-one.repository';
import { PaymentModel } from './infra/repositories/payments.entity';
import { CreateWalletService } from './infra/services/create.service';
import { PaymentsController } from './payments.controller';

@Module({
	imports: [TypeOrmModule.forFeature([PaymentModel])],
	controllers: [PaymentsController],
	providers: [
		// Repositories
		CreateWalletRepository,
		FindOneWalletRepository,
		// Services
		CreateWalletService
	],
	exports: [TypeOrmModule]
})
export class PaymentsModule {}
