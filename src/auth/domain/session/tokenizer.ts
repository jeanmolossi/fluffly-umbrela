import { SessionsV2 } from './namespace';

export namespace Tknizer {
	export interface BasicProps {
		user: string;
		password: string;
	}
}

export class Tokenizer {
	protected _decoder: SessionsV2.Decoder;
	protected _encoder: SessionsV2.Encoder;

	constructor(protected readonly _basic_props: Tknizer.BasicProps) {}

	get basic(): string {
		const { user, password } = this._basic_props;
		return Buffer.from(`${user}:${password}`).toString('base64');
	}

	static extractInfo(basic_token: string): Tknizer.BasicProps {
		// removes basic prefix when it presents and trim whitespaces
		basic_token = basic_token.replace(/^basic\s/i, '').trim();
		// decode URI components from token
		basic_token = decodeURIComponent(basic_token);
		// decode base64 to ascii readable token
		const decoded = Buffer.from(basic_token, 'base64').toString('ascii');

		const [user, password] = decoded.split(':');

		return {
			user,
			password
		};
	}

	attachDecoder(decoder: SessionsV2.Decoder): Tokenizer {
		this._decoder = decoder;
		return this;
	}

	attachEncoder(encoder: SessionsV2.Encoder): Tokenizer {
		this._encoder = encoder;
		return this;
	}

	protected hasDecoder(context: string): boolean {
		if (!this._decoder) {
			throw new TypeError(
				`You should attach a decoder to use ${context} method`
			);
		}

		return true;
	}

	protected hasEndoder(context: string): boolean {
		if (!this._encoder) {
			throw new TypeError(
				`You should attach a encoder to use ${context} method`
			);
		}

		return true;
	}
}
