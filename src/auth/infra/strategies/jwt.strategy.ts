import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';
import { AuthService } from '@/auth/auth.service';
import constants from '@/shared/shared.constants';
import { JwtStrategyBase } from './jwt-base.strategy';

@Injectable()
export class JwtStrategy extends PassportStrategy(JwtStrategyBase) {
	constructor(
		private readonly config: ConfigService,
		private readonly authService: AuthService
	) {
		super(
			{
				jwtFromRequest: ExtractJwt.fromExtractors([
					JwtStrategy.fromCookies,
					JwtStrategy.fromBasicHeader
				]),
				ignoreExpiration: false,
				secretOrKey: config.get('ACCESS_TOKEN_SECRET')
			},
			authService.validateSession.bind(authService)
		);
	}

	private static fromCookies(request: Request) {
		return request.cookies[constants.AUTH_TOKEN];
	}

	private static fromBasicHeader(request: Request): string {
		return request.headers.authorization;
	}
}
