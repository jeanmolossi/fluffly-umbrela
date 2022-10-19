import {
	BadRequestException,
	Body,
	Controller,
	Post,
	Request,
	Response
} from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request as eRequest, Response as eResponse } from 'express';
import { HttpStatus } from '@/shared/domain/http-status';
import { RecoverAccount } from './infra/adapters/recover-account';
import { RegisterUser } from './infra/adapters/register-user';
import { ResetPassword } from './infra/adapters/reset-password';
import { CreateService } from './infra/services/create.service';
import { RecoverAccountService } from './infra/services/recover-account.service';
import { ResetPasswordService } from './infra/services/reset-password.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
	constructor(
		private readonly createUserService: CreateService,
		private readonly recoverAccountService: RecoverAccountService,
		private readonly resetPasswordService: ResetPasswordService
	) {}

	@Post()
	@ApiBody({ type: RegisterUser })
	@ApiOperation({
		summary: 'Create a new user',
		description: 'Use that endpoint to send a new user register'
	})
	async create(
		@Body() register: RegisterUser,
		@Response() response: eResponse
	) {
		const user = await this.createUserService.run(register);
		return response.status(HttpStatus.CREATED).json(user);
	}

	@Post('/recover-account')
	@ApiBody({ type: RecoverAccount })
	@ApiOperation({
		summary: 'Recover user account',
		description: 'Use that endpoint to send an e-mail to recover account'
	})
	async recoverAccount(
		@Body('email') email: string,
		@Response() response: eResponse
	) {
		const otp = await this.recoverAccountService.run(email);

		return (
			response
				.status(HttpStatus.ACCEPTED)
				.setHeader('X-Request-Timestamp', otp.timestamp)
				.setHeader('X-Hash', otp.generate())
				// eslint-disable-next-line
				.json({ OTP: otp.otp })
		);
	}

	@Post('/reset-password')
	@ApiBody({ type: ResetPassword })
	@ApiHeader({
		required: true,
		name: 'x-request-timestamp',
		example: Date.now()
	})
	@ApiHeader({
		required: true,
		name: 'x-hash',
		example: 'fe61d8a1774d841f9741645c7b43e0c2757a1aa2'
	})
	async resetPassword(
		@Body() reset_password: ResetPassword,
		@Request() request: eRequest,
		@Response() response: eResponse
	) {
		const timestamp = request.headers['x-request-timestamp'];
		const hash = request.headers['x-hash'];

		if (!timestamp || !hash) {
			throw new BadRequestException('Reset password request failed');
		}

		reset_password.timestamp = +timestamp;
		reset_password.hash = hash.toString();

		const user = await this.resetPasswordService.run(reset_password);

		return response.status(HttpStatus.OK).json(user);
	}
}
