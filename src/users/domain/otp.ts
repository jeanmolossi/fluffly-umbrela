import { createHmac } from "crypto";

export namespace OTP {
	/** Model is the otp to generate a hash */
	export interface Model {
		email: string;
		otp: number;
		timestamp: number;
	}
}

export class OTP {
	constructor(
		private readonly _props: OTP.Model,
		private readonly _secret: string = "DEV"
	) {}

	/**
	 * generate is a method who will generate a hash to validate otp
	 * @returns {string} hmac hash
	 */
	public generate(): string {
		const { email, otp, timestamp } = this._props;
		const key = `${email}:${otp}:${timestamp}`;
		const hmac = createHmac("sha1", this._secret).update(key).digest("hex");
		return hmac;
	}

	/**
	 * isValid is a method to check if hash received matches with otp
	 * @param hash is hash to check if is otp valid
	 * @returns {boolean} true or false to isValid hash
	 */
	public isValid(hash: string): boolean {
		if (this.isExpired()) {
			return false;
		}

		return hash === this.generate();
	}

	/**
	 * isExpired will check if timestamp was expired
	 * @returns {boolean} true of false to timestamp expired
	 */
	private isExpired(): boolean {
		return this._props.timestamp <= Date.now();
	}

	get email(): string {
		return this._props.email
	}

	get otp(): string {
		return `${this._props.otp}`.padStart(6, '0')
	}

	get timestamp(): number {
		return this._props.timestamp
	}
}
