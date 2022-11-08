import { randomUUID } from 'crypto';
import { UnauthorizedErr } from '@/shared/domain/http-errors';
import { Sessions } from './namespace';

export class Session {
	private _decoder: Sessions.Decoder;

	constructor(private readonly _props: Sessions.Model) {
		_props.session_id = _props.session_id ?? randomUUID();
		this.validate();
	}

	private validate() {
		const { session_id, user_id, session_token, refresh_token } =
			this._props;

		if (!session_id || !user_id || !session_token || !refresh_token) {
			throw new UnauthorizedErr('Can not initiate a session');
		}
	}

	get id(): string {
		return this._props.session_id;
	}

	get user_id(): string {
		return this._props.user_id;
	}

	get session_token(): string {
		return this._props.session_token;
	}

	get refresh_token(): string {
		return this._props.refresh_token;
	}

	get oauth(): string {
		const user_id = this._props.user_id;
		const session_id = this._props.session_id;

		return Buffer.from(`${user_id}:${session_id}`).toString('base64');
	}

	static extractInfo(basic_token: string): Sessions.Info {
		// removes basic prefix when it presents and trim whitespaces
		basic_token = basic_token.replace(/^basic\s/i, '').trim();
		// decode URI components from token
		basic_token = decodeURIComponent(basic_token);
		// decode base64 to ascii readable token
		const decoded = Buffer.from(basic_token, 'base64').toString('ascii');

		const [user_id, session_id] = decoded.split(':');

		return {
			user_id,
			session_id
		};
	}

	attachDecoder(decoder: Sessions.Decoder): Session {
		this._decoder = decoder;
		return this;
	}

	isExpired(): boolean {
		this.hasDecoder('isExpired');

		try {
			this._decoder(this._props.session_token, {
				issuer: 'session',
				secret: process.env.ACCESS_TOKEN_SECRET,
				subject: this._props.user_id
			});
		} catch (e) {
			console.log('access_token', e.message);

			return true;
		}

		try {
			this._decoder(this._props.refresh_token, {
				issuer: 'refresh',
				secret: process.env.REFRESH_TOKEN_SECRET,
				subject: this._props.user_id
			});
		} catch (e) {
			console.log('refresh_token', e.message);

			return true;
		}

		return false;
	}

	private hasDecoder(context: string): boolean {
		if (!this._decoder) {
			throw new TypeError(
				`You should attach a decoder to use ${context} method`
			);
		}

		return true;
	}
}
