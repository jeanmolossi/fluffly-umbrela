import { HttpStatus } from './http-status';

export class HttpError extends Error {
	constructor(
		public message: string = 'Internal Server Error',
		public statusCode: number = 500
	) {
		super(message);
	}

	public getStatus() {
		return this.statusCode;
	}
}

export class InternalServerErr extends HttpError {
	constructor(public readonly message: string = 'Internal Server Error') {
		super(message);
	}
}

export class BadRequestErr extends HttpError {
	constructor(public readonly message: string = 'Bad Request Error') {
		super(message, HttpStatus.BAD_REQUEST);
	}
}

export class UnauthorizedErr extends HttpError {
	constructor(public readonly message: string = 'Unauthorized Error') {
		super(message, HttpStatus.UNAUTHORIZED);
	}
}

export class ConflictErr extends HttpError {
	constructor(public readonly message: string = 'Conflict Error') {
		super(message, HttpStatus.CONFLICT);
	}
}

export class NotFoundErr extends HttpError {
	constructor(public readonly message: string = 'Not Found Error') {
		super(message, HttpStatus.NOT_FOUND);
	}
}
