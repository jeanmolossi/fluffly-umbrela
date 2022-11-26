import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import 'reflect-metadata';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/infra/http-exception.filter';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: ['log', 'error', 'warn', 'debug'],
		autoFlushLogs: true,
		bufferLogs: true
	});

	// @ts-ignore
	app.use(cookieParser());
	app.enableCors({
		origin: [
			'http://localhost',
			'http://localhost:3000',
			'http://192.168.100.11',
			'http://192.168.100.11:3000'
		],
		credentials: true,
		allowedHeaders: [
			'x-timestamp',
			'x-hash',
			'authorization',
			'x-refresh-token'
		]
	});
	app.use(helmet());

	app.useGlobalPipes(new ValidationPipe({ transform: true }));
	app.useGlobalFilters(new HttpExceptionFilter());

	const config = new DocumentBuilder()
		.setTitle('Fluffy Umbrela')
		.setDescription('The financial complete API to manage your finances')
		.setVersion('1.0')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('swagger', app, document);

	await app.listen(3000);
}
bootstrap();
