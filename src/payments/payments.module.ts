import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateWalletRepository } from './infra/repositories/create.repository';
import { FindOneWalletRepository } from './infra/repositories/find-one.repository';
import { FindWalletRepository } from './infra/repositories/find.repository';
import { PaymentModel } from './infra/repositories/payments.entity';
import { CreateWalletService } from './infra/services/create.service';
import { FindMyWalletsService } from './infra/services/find.service';
import { PaymentsController } from './payments.controller';

@Module({
	imports: [TypeOrmModule.forFeature([PaymentModel])],
	controllers: [PaymentsController],
	providers: [
		// Repositories
		CreateWalletRepository,
		FindOneWalletRepository,
		FindWalletRepository,
		// Services
		CreateWalletService,
		FindMyWalletsService
	],
	exports: [TypeOrmModule]
})
export class PaymentsModule {}
