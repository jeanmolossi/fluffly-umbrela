import { SharedModule } from '@/shared/shared.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateRepository } from './infra/repository/create.repository';
import { FindOneRepository } from './infra/repository/find-one.repository';
import { SaveRepository } from './infra/repository/save.repository';
import { UserModel } from './infra/repository/user.entity';
import { CreateService } from './infra/services/create.service';
import { RecoverAccountService } from './infra/services/recover-account.service';
import { ResetPasswordService } from './infra/services/reset-password.service';
import { UsersController } from './users.controller';

@Module({
	imports: [TypeOrmModule.forFeature([UserModel]), SharedModule],
	controllers: [UsersController],
	providers: [
		// REPOSITORIES
		CreateRepository,
		FindOneRepository,
		SaveRepository,
		// SERVICES
		CreateService,
		RecoverAccountService,
		ResetPasswordService
	],
	exports: [TypeOrmModule, FindOneRepository]
})
export class UsersModule {}
