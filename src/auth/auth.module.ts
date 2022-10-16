import { JwtModuleFactory } from '@/app.modules';
import { UsersModule } from '@/users/users.module';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateSessionRepository } from './infra/repository/create.repository';
import { FindOneSessionRepository } from './infra/repository/find-one.repository';
import { SessionModel } from './infra/repository/session.entity';
import { JwtStrategy } from './infra/strategies/jwt.strategy';
import { LocalStrategy } from './infra/strategies/local.strategy';

@Module({
	imports: [
		TypeOrmModule.forFeature([SessionModel]),
		UsersModule,
		PassportModule,
		JwtModuleFactory()
	],
	controllers: [AuthController],
	providers: [
		// Repositories
		CreateSessionRepository,
		FindOneSessionRepository,
		// Services
		AuthService,
		JwtService,
		// Strategies
		LocalStrategy,
		JwtStrategy
	]
})
export class AuthModule {}
