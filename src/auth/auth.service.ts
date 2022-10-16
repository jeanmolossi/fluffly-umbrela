import { UnauthorizedErr } from '@/shared/domain/http-errors';
import { User, Users } from '@/users/domain';
import { FindOneRepository } from '@/users/infra/repository/find-one.repository';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Credentials } from './adapter/credentials';
import { Session, Sessions } from './domain';
import { CreateSessionRepository } from './infra/repository/create.repository';

@Injectable()
export class AuthService {
	constructor(
		private readonly config: ConfigService,
		private readonly jwtService: JwtService,
		@Inject(FindOneRepository)
		private readonly findOne: Users.FindOneRepository,
		@Inject(CreateSessionRepository)
		private readonly create: Sessions.CreateRepository
	) {}

	async validateUser(credentials: Credentials) {
		const { email } = credentials;

		const user = await this.findOne.run({ email });

		if (!user.isValidPassword(credentials.password)) {
			throw new UnauthorizedErr('Invalid credentials');
		}

		return user;
	}

	async login(user: User) {
		const payload = { email: user.email };

		const session_token = this.getAccessToken(payload, user);
		const refresh_token = this.getRefreshToken(payload, user);

		const session = await this.create.run(
			new Session({
				session_token,
				refresh_token,
				user_id: user.id
			})
		);

		return session;
	}

	async logout() {
		return `This action returns all auth`;
	}

	async me() {
		return `This action returns a #${'id'} auth`;
	}

	private getAccessToken(payload: object, user: User): string {
		return this.jwtService.sign(payload, {
			subject: user.id,
			issuer: 'session',
			expiresIn: this.config.get('ACCESS_TOKEN_EXPIRES'),
			secret: this.config.get('ACCESS_TOKEN_SECRET')
		});
	}

	private getRefreshToken(payload: object, user: User): string {
		return this.jwtService.sign(payload, {
			subject: user.id,
			issuer: 'refresh',
			expiresIn: this.config.get('REFRESH_TOKEN_SECRET'),
			secret: this.config.get('REFRESH_TOKEN_SECRET')
		});
	}
}
