import { DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

export function ConfigModuleFactory(): DynamicModule {
	return ConfigModule.forRoot({
		envFilePath: ['.env.development.local', '.env'],
		isGlobal: true
	});
}

export function TypeOrmModuleFactory(): DynamicModule {
	const use_factory = (config: ConfigService) =>
		Promise.resolve({
			type: 'postgres',
			host: config.get('DB_HOST'),
			port: +config.get('DB_PORT'),
			username: config.get('DB_USER'),
			password: config.get('DB_PASSWORD'),
			database: config.get('DB_NAME'),
			entities: [
				__dirname + '/**/infra/repository/*.entity.{ts,js}',
				__dirname + '/**/infra/repositories/*.entity.{ts,js}'
			],
			synchronize: config.get('NODE_ENV') === 'development',
			logging: ['schema', 'error'],
			seeds: [
				__dirname + '/**/infra/repository/*.seed.{ts,js}',
				__dirname + '/**/infra/repositories/*.seed.{ts,js}'
			],
			factories: [
				__dirname + '/**/infra/repository/*.factory.{ts,js}',
				__dirname + '/**/infra/repositories/*.factory.{ts,js}'
			]
		} as TypeOrmModuleOptions);

	return TypeOrmModule.forRootAsync({
		imports: [ConfigModule],
		inject: [ConfigService],
		useFactory: use_factory
	});
}

export function JwtModuleFactory(): DynamicModule {
	const use_factory = (config: ConfigService) =>
		Promise.resolve({
			secret: config.get('ACCESS_TOKEN_SECRET'),
			signOptions: { expiresIn: config.get('ACCESS_TOKEN_EXPIRES') }
		} as JwtModuleOptions);

	return JwtModule.registerAsync({
		imports: [ConfigModule],
		useFactory: use_factory,
		inject: [ConfigService]
	});
}
