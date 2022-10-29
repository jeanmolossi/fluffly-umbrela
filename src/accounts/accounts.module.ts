import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsController } from './accounts.controller';
import { TransactionAddedListener } from './infra/listeners/transaction-added.listener';
import { AccountModel } from './infra/repositories/account.entity';
import { CreateAccountRepository } from './infra/repositories/create.repository';
import { FindOneAccountRepository } from './infra/repositories/find-one.repository';
import { FindAccountRepository } from './infra/repositories/find.repository';
import { UpdateAccountRepository } from './infra/repositories/update.repository';
import { AddAccountService } from './infra/services/add-account.service';
import { GetMyAccountsService } from './infra/services/my-accounts.service';

@Module({
	imports: [TypeOrmModule.forFeature([AccountModel])],
	controllers: [AccountsController],
	providers: [
		// Repositories
		CreateAccountRepository,
		FindOneAccountRepository,
		FindAccountRepository,
		UpdateAccountRepository,
		// Services
		AddAccountService,
		GetMyAccountsService,
		// Listeners
		TransactionAddedListener
	],
	exports: [TypeOrmModule]
})
export class AccountsModule {}
