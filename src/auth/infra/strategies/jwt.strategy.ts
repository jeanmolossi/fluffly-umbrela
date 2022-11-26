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
				secretOrKey: config.get('REFRESH_TOKEN_SECRET')
			},
			authService.validateSession.bind(authService)
		);
	}

	private static fromCookies(request: Request) {
		const auth_token = request.cookies[constants.AUTH_TOKEN];
		const refresh_token = request.cookies[constants.REFRESH_TOKEN];

		if (!auth_token && !refresh_token) return ``;

		return `${auth_token}___${refresh_token}`;
	}

	private static fromBasicHeader(request: Request): string {
		let basic: string;
		let refresh: string;

		if (request.headers?.authorization) {
			basic = decodeURIComponent(
				request.headers?.authorization?.replace(/basic\s/gi, '')
			);
		}

		if (request.headers?.['x-refresh-token']) {
			refresh = request.headers?.['x-refresh-token'] as string;
		}

		if (!basic && !refresh) return ``;

		return `${basic}___${refresh}`;
	}
}
