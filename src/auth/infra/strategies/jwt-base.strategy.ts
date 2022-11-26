import { Request } from 'express';
import { Strategy } from 'passport-strategy';
import { User } from '@/users/domain';

export type Tokens = { basic: string; refresh: string };
type Extractor = (request: Request) => string;

interface Options {
	jwtFromRequest: Extractor;
	ignoreExpiration: boolean;
	secretOrKey: string;
}

export class JwtStrategyBase extends Strategy {
	name: string = 'jwt';

	constructor(
		private readonly options: Options,
		private readonly _verify: (
			tokens: Tokens,
			done: (t: any) => any
		) => Promise<User>
	) {
		super();
	}

	async authenticate(request: Request, _options?: any) {
		const self = this;
		const request_tokens = this.options.jwtFromRequest(request);

		const token_array = request_tokens?.split('___');
		if (token_array.length === 0)
			return this.fail(new Error(`No auth tokens`), 401);

		const [basic, refresh] = token_array;

		if (!basic && !refresh)
			return this.fail(new Error(`No auth tokens`), 401);

		const tokens = { basic, refresh };

		if (!tokens.basic && !tokens.refresh)
			return this.fail(new Error('No auth token'), 401);

		try {
			const done = (user: User, info?: any) => {
				request.user = user;
				self.success(user, info);
			};

			await this._verify(tokens, done);
		} catch (e) {
			console.log('fail', e.message);
			return self.fail(e, e.status);
		}
	}
}
