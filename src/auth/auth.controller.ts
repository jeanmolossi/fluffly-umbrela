import {
	Controller,
	Get,
	Post,
	Request,
	Response,
	UseGuards
} from '@nestjs/common';
import { ApiBasicAuth, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request as eRequest, Response as eResponse } from 'express';
import { UnauthorizedErr } from '@/shared/domain/http-errors';
import { HttpStatus } from '@/shared/domain/http-status';
import { addMinutes } from '@/shared/helpers/date-math';
import { AuthUser } from '@/shared/infra/decorators/user.decorator';
import constants from '@/shared/shared.constants';
import { User } from '@/users/domain';
import { Credentials } from './adapter/credentials';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './infra/guards/jwt-auth.guard';
import { LocalAuthGuard } from './infra/guards/local-auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	@UseGuards(LocalAuthGuard)
	@ApiBody({ required: true, type: Credentials })
	async login(@Request() request: eRequest, @Response() response: eResponse) {
		const user = request.user as User;
		const session = await this.authService.login(user);

		response.cookie(constants.AUTH_TOKEN, session.basic, {
			expires: addMinutes(new Date(), constants.AUTH_EXPIRES_IN),
			httpOnly: true
		});
		response.cookie(constants.REFRESH_TOKEN, session.refresh, {
			expires: addMinutes(new Date(), constants.REFRESH_EXPIRES_IN),
			httpOnly: true
		});

		response.setHeader(constants.AUTH_TOKEN, session.basic);
		response.setHeader(constants.REFRESH_TOKEN, session.refresh);

		return response.status(HttpStatus.CREATED).send();
	}

	@Post('refresh_token')
	@ApiOkResponse()
	async refresh(
		@Request() request: eRequest,
		@Response() response: eResponse
	) {
		const basic =
			request.cookies[constants.AUTH_TOKEN] ??
			request.headers?.authorization;
		const refresh =
			request.cookies[constants.REFRESH_TOKEN] ??
			request.headers?.['x-refresh-token'];

		if (!basic && !refresh)
			throw new UnauthorizedErr('You make to do login again');

		const session = await this.authService.refresh({ basic, refresh });

		response.cookie(constants.AUTH_TOKEN, session.basic, {
			expires: addMinutes(new Date(), constants.AUTH_EXPIRES_IN),
			httpOnly: true
		});
		response.cookie(constants.REFRESH_TOKEN, session.refresh, {
			expires: addMinutes(new Date(), constants.REFRESH_EXPIRES_IN),
			httpOnly: true
		});

		response.setHeader(constants.AUTH_TOKEN, session.basic);
		response.setHeader(constants.REFRESH_TOKEN, session.refresh);

		return response.status(HttpStatus.CREATED).send();
	}

	@Post('logout')
	@UseGuards(JwtAuthGuard)
	@ApiBasicAuth(constants.AUTH_TOKEN)
	async logout(
		@Request() request: eRequest,
		@Response() response: eResponse
	) {
		await this.authService.logout(
			request.cookies[constants.AUTH_TOKEN] ??
				request.headers.authorization
		);

		response.cookie(constants.AUTH_TOKEN, '', { expires: new Date(0) });
		response.cookie(constants.REFRESH_TOKEN, '', { expires: new Date(0) });

		return response.status(HttpStatus.ACCEPTED).send();
	}

	@Get('me')
	@UseGuards(JwtAuthGuard)
	@ApiBasicAuth(constants.AUTH_TOKEN)
	async me(@AuthUser() user: User) {
		return this.authService.me(user);
	}
}
