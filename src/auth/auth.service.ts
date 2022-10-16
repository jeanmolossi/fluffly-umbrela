import {
	InternalServerErr,
	UnauthorizedErr
} from '@/shared/domain/http-errors';
import { User, Users } from '@/users/domain';
import { FindOneRepository } from '@/users/infra/repository/find-one.repository';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Credentials } from './adapter/credentials';
import { Session, Sessions } from './domain';
import { CreateSessionRepository } from './infra/repository/create.repository';
import { DeleteSessionRepository } from './infra/repository/delete.repository';
import { FindOneSessionRepository } from './infra/repository/find-one.repository';

type DoneCb = (user: User, info?: any) => void;

@Injectable()
export class AuthService {
	constructor(
		private readonly config: ConfigService,
		private readonly jwtService: JwtService,
		@Inject(FindOneRepository)
		private readonly findOneUser: Users.FindOneRepository,
		@Inject(CreateSessionRepository)
		private readonly create: Sessions.CreateRepository,
		@Inject(FindOneSessionRepository)
		private readonly findOneSession: Sessions.FindOneRepository,
		@Inject(DeleteSessionRepository)
		private readonly deleteSession: Sessions.DeleteRepository
	) {}

	async validateUser(credentials: Credentials) {
		const { email } = credentials;

		const user = await this.findOneUser.run({ email });

		if (!user.isValidPassword(credentials.password)) {
			throw new UnauthorizedErr('Invalid credentials');
		}

		return user;
	}

	async login(user: User) {
		const isset_session = await this.findOneSession.run({
			user_id: user.id
		});

		if (isset_session) {
			isset_session.attachDecoder(
				this.jwtService.verify.bind(this.jwtService)
			);

			if (isset_session.isExpired()) {
				if (!(await this.deleteSession.run(isset_session.id)))
					throw new InternalServerErr('Can not login, try again');
			}
		}

		const payload = { email: user.email };

		const session_token = this.getAccessToken(payload, user);
		const refresh_token = this.getRefreshToken(payload, user);

		const session = await this.create.run(
			new Session({
				session_id: isset_session?.id,
				session_token,
				refresh_token,
				user_id: user.id
			})
		);

		return session;
	}

	async validateSession(basic_token: string, done: DoneCb) {
		const session = await this.findOneSession.run(
			Session.extractInfo(basic_token)
		);

		const decoder = this.jwtService.verify.bind(this.jwtService);

		if (!session || session.attachDecoder(decoder).isExpired())
			throw new UnauthorizedErr('Unauthorized');

		const user = await this.findOneUser.run({ id: session.user_id });

		return done(user);
	}

	async logout() {
		return `This action returns all auth`;
	}

	async me(user: User) {
		const { id, name, email, avatar } = user;
		return { id, name, email, avatar };
	}

	private getAccessToken(payload: object, user: User): string {
		return this.jwtService.sign(payload, {
			subject: user.id,
			issuer: 'session',
			expiresIn: 15,
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
