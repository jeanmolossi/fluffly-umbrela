import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { AppController } from './app.controller';
import { ConfigModuleFactory, TypeOrmModuleFactory } from './app.modules';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { PaymentsModule } from './payments/payments.module';
import { PlanningModule } from './planning/planning.module';
import { LoggerMiddleware } from './shared/infra/middlewares/logger.middleware';
import { SharedModule } from './shared/shared.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UsersModule } from './users/users.module';

@Module({
	imports: [
		ConfigModuleFactory(),
		TypeOrmModuleFactory(),
		UsersModule,
		SharedModule,
		AccountsModule,
		PaymentsModule,
		CategoriesModule,
		TransactionsModule,
		PlanningModule,
		AuthModule
	],
	controllers: [AppController],
	providers: [Logger],
	exports: [Logger]
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
