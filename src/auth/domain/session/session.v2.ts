import { randomBytes, randomUUID } from 'crypto';
import { parseToMs } from '@/shared/helpers/date-math';
import { SessionsV2 } from './namespace';
import { Tokenizer } from './tokenizer';

export class Session extends Tokenizer implements SessionsV2.Model {
	public id: string;
	public user_id: string;
	public token: string;
	public refresh: string;
	public created_at: number;

	constructor(_props: Partial<SessionsV2.Model>) {
		const { id = randomUUID(), user_id, token, refresh } = _props;

		super({ user: user_id, password: id });

		this.id = id;
		this.user_id = user_id;
		this.token = token ?? this.randomToken();
		this.refresh = refresh;
		this.created_at = _props.created_at ?? Date.now();
	}

	private randomToken() {
		return randomBytes(32).toString('hex');
	}

	public isValidRefresh() {
		this.hasDecoder('isValidRefresh');

		try {
			const payload = this._decoder<{ code: string }>(this.refresh, {
				issuer: 'refresh',
				secret: process.env.REFRESH_TOKEN_SECRET,
				subject: this.user_id
			});

			return payload.code === this.token;
		} catch (e) {
			return false;
		}
	}

	public isExpiredSession(): boolean {
		const expires_in = parseToMs(process.env.ACCESS_TOKEN_EXPIRES as any);
		const expiration_date = this.created_at + expires_in;
		return expiration_date < Date.now();
	}

	attachDecoder(decoder: SessionsV2.Decoder): Session {
		super.attachDecoder(decoder);
		return this;
	}
}
