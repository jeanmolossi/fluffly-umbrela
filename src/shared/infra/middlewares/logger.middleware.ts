import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	constructor(private readonly logger: Logger) {}

	use(request: Request, _response: Response, next: NextFunction) {
		const tracing = this.trace(request.baseUrl, request.method);
		request.on('close', tracing);
		next();
	}

	private trace(path: string, method: string) {
		const start = Date.now();

		this.logger.log(
			`Started ${method} request ${path}`,
			'TracingMiddleware'
		);

		return () => {
			const duration = Date.now() - start;
			this.logger.log(
				`End ${method} request ${path} in ${duration}ms`,
				'TracingMiddleware'
			);
		};
	}
}
