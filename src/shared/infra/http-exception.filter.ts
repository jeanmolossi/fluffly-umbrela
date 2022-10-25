import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpStatus
} from '@nestjs/common';
import { Response } from 'express';
import { HttpError } from '../domain/http-errors';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const status =
			exception?.getStatus?.() || HttpStatus.INTERNAL_SERVER_ERROR;

		const message = exception.message || 'Internal Server Error';

		if (process.env.NODE_ENV === 'development') {
			console.log(exception.stack);
		}

		return response.status(status).json({
			statusCode: status,
			message
		});
	}
}
