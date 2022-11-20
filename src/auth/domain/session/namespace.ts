import { Session } from './session';

export namespace Sessions {
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

	export interface DecoderOptions {
		secret: string;
		issuer: 'session' | 'refresh';
		subject: string;
	}

	export type Decoder = <T extends object>(
		token: string,
		options: DecoderOptions
	) => T;
}
