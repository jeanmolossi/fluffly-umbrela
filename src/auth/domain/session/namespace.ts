import { Session } from './session.v2';

export namespace SessionsV2 {
	export interface Model {
		id: string;
		user_id: string;
		basic: string;
		token: string;
		refresh: string;
		created_at: number;
	}

	export interface Info {
		id: string;
		user_id: string;
	}

	type ApplicationIssuer = 'session' | 'refresh';

	export interface DecoderOptions {
		secret: string;
		issuer: ApplicationIssuer;
		subject: string;
	}

	export type Decoder = <T extends object>(
		token: string,
		options: DecoderOptions
	) => T;

	export interface EncoderOptions extends DecoderOptions {
		expiresIn: string | number;
	}

	export type Encoder = <T extends object>(
		payload: T,
		options?: EncoderOptions
	) => string;

	export interface CreateRepository {
		run(session: Session): Promise<Session>;
	}

	export interface FindOneRepository {
		run(session: Partial<Model>): Promise<Session>;
	}

	export interface DeleteRepository {
		run(info: Info): Promise<boolean>;
	}
}

// eslint-disable-next-line no-unused-vars
namespace Sessions {
	export interface Model {
		session_id?: string;
		user_id: string;
		session_token: string;
		refresh_token: string;
	}

	export interface Info {
		user_id: string;
		session_id: string;
	}

	export interface CreateRepository {
		run(session: Session): Promise<Session>;
	}

	export interface FindOneRepository {
		run(session: Partial<Model>): Promise<Session>;
	}

	export interface DeleteRepository {
		run(info: Info): Promise<boolean>;
	}

	export type Updater = (session: Session) => Session;
	export interface RefreshSession {
		run(session_id: string, updateCb: Updater): Promise<Session>;
	}

	type ApplicationIssuer = 'session' | 'refresh';

	export interface DecoderOptions {
		secret: string;
		issuer: ApplicationIssuer;
		subject: string;
	}

	export type Decoder = <T extends object>(
		token: string,
		options: DecoderOptions
	) => T;

	export interface EncoderOptions extends DecoderOptions {
		expiresIn: string | number;
	}

	export type Encoder = <T extends object>(
		payload: T,
		options?: EncoderOptions
	) => string;
}
