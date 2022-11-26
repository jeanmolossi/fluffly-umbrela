import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
	InternalServerErr,
	UnauthorizedErr
} from '@/shared/domain/http-errors';
import { User, Users } from '@/users/domain';
import { FindOneRepository } from '@/users/infra/repository/find-one.repository';
import { Credentials } from './adapter/credentials';
import { Session, Sessions } from './domain';
import { CreateSessionRepository } from './infra/repository/create.repository';
import { DeleteSessionRepository } from './infra/repository/delete.repository';
import { FindOneSessionRepository } from './infra/repository/find-one.repository';
import { Tokens } from './infra/strategies/jwt-base.strategy';

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

		if (!user?.isValidPassword(credentials.password)) {
			throw new UnauthorizedErr('Invalid credentials');
		}

		return user;
	}

	async login(user: User) {
		const isset_session = await this.findOneSession.run({
			user_id: user.id
		});

		if (isset_session) {
			if (isset_session.isExpiredSession()) {
				const session_deleted = await this.deleteSession.run({
					id: isset_session.id,
					user_id: isset_session.user_id
				});

				if (!session_deleted)
					throw new InternalServerErr('Can not login, try again');
			}
		}

		const new_session = new Session({
			id: isset_session?.id,
			user_id: user.id,
			token: isset_session?.token,
			created_at: Date.now()
		});

		const { token: code, id } = new_session;

		new_session.refresh = this.getRefreshToken({ code, id }, user);

		const session = await this.create.run(new_session);

		return session;
	}

	async validateSession(tokens: Tokens, done: DoneCb) {
		const { basic: basic_token } = tokens;
		const { user: user_id, password } = Session.extractInfo(basic_token);

		const session = await this.findOneSession.run({
			user_id,
			id: password
		});

		if (!session || session.isExpiredSession()) {
			if (session) await this.deleteSession.run(session);
			throw new UnauthorizedErr('Unauthorized');
		}

		const user = await this.findOneUser.run({ id: session.user_id });

		return done(user);
	}

	async refresh(tokens: Tokens) {
		const { refresh } = tokens;

		// get user id and session id from refresh token
		const { id, user_id, code } = this.get_refresh_decoded(refresh);

		let session = await this.findOneSession.run({
			id,
			user_id
		});

		if (session) {
			await this.deleteSession.run({ id, user_id });
			const decoder = this.jwtService.verify.bind(this.jwtService);
			session.attachDecoder(decoder).refresh = tokens.refresh;
		}

		const is_valid_refresh = session?.isValidRefresh() || false;

		if (is_valid_refresh) {
			const new_session =
				session ??
				new Session({
					user_id,
					token: code,
					refresh
				});

			return await this.create.run(new_session);
		}

		const user = await this.findOneUser.run({ id: user_id });
		if (!user) throw new UnauthorizedErr('Invalid Credentials');

		if (!session) {
			session = new Session({
				user_id,
				token: code,
				refresh
			});
		}

		session.refresh = this.getRefreshToken({ code, id }, user);
		const new_session = await this.create.run(session);

		return new_session;
	}

	private get_refresh_decoded(refresh: string) {
		try {
			const {
				code,
				id,
				sub: user_id
			} = this.jwtService.verify<{
				code: string;
				id: string;
				sub: string;
			}>(refresh, {
				issuer: 'refresh',
				secret: this.config.get('REFRESH_TOKEN_SECRET')
			});

			return {
				code,
				id,
				user_id
			};
		} catch (e) {
			console.log(e);
			throw e;
		}
	}

	async logout(basic_token: string) {
		if (!basic_token) return {};

		const { password: id, user: user_id } =
			Session.extractInfo(basic_token);

		await this.deleteSession.run({ id, user_id });

		return {};
	}

	async me(user: User) {
		const { id, name, email, avatar } = user;
		return { id, name, email, avatar };
	}

	private getRefreshToken(payload: object, user: User): string {
		return this.jwtService.sign(payload, {
			subject: user.id,
			issuer: 'refresh',
			expiresIn: this.config.get('REFRESH_TOKEN_EXPIRES'),
			secret: this.config.get('REFRESH_TOKEN_SECRET')
		});
	}
}
