import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly config: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				JwtStrategy.fromCookies,
				JwtStrategy.fromBasicHeader
			]),
			ignoreExpiration: false,
			secretOrKey: config.get('ACCESS_TOKEN_SECRET')
		});
	}

	async validate(payload: any) {
		return { userId: payload.sub, username: payload.username };
	}

	private static fromCookies(request: Request): string {
		console.log(request.cookies['oauth']);
		return ''; // request.cookies['oauth'];
	}

	private static fromBasicHeader(request: Request): string {
		console.log(request.headers.authorization);
		return '';
	}
}
