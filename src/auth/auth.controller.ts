import { HttpStatus } from '@/shared/domain/http-status';
import { User } from '@/users/domain';
import {
	Controller,
	Get,
	Post,
	Request,
	Response,
	UseGuards
} from '@nestjs/common';
import { ApiBasicAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Request as eRequest, Response as eResponse } from 'express';
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

		response.cookie('oauth', session.oauth);
		response.setHeader('oauth', session.oauth);

		return response.status(HttpStatus.CREATED).send();
	}

	@Post('logout')
	@ApiBasicAuth('oauth')
	async logout(
		@Request() request: eRequest,
		@Response() response: eResponse
	) {
		await this.authService.logout(
			request.cookies['oauth'] ?? request.headers.authorization
		);

		response.cookie('oauth', '', { expires: new Date(0) });

		return response.status(HttpStatus.ACCEPTED).send();
	}

	@Get('me')
	@UseGuards(JwtAuthGuard)
	@ApiBasicAuth('oauth')
	async me(@Request() request: eRequest) {
		return this.authService.me(request.user as User);
	}
}
