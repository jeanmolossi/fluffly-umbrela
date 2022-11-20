import { Inject, Injectable } from '@nestjs/common';
import { Session, Sessions } from '@/auth/domain';
import { DynamoDBRepositoryAdapter } from './dynamo-adapter/dynamo-adapter.repository';

@Injectable()
export class CreateSessionRepository implements Sessions.CreateRepository {
	constructor(
		@Inject(DynamoDBRepositoryAdapter)
		private readonly sessionRepository: DynamoDBRepositoryAdapter
	) {}

	async run(session: Session): Promise<Session> {
		const isset_session = await this.sessionAlreadyExists(
			session.user_id,
			session.id
		);

		if (isset_session) return isset_session;

		const { user_id, session_id, session_token, refresh_token } =
			await this.sessionRepository.create({
				user_id: session.user_id,
				session_id: session.id,
				refresh_token: session.refresh_token,
				session_token: session.session_token
			});

		return new Session({
			user_id,
			session_id,
			session_token,
			refresh_token
		});
	}

	async sessionAlreadyExists(user_id: string, session_id: string) {
		const result = await this.sessionRepository.findOneBy({
			user_id,
			session_id
		});

		if (!result) return null;

		const { session_token, refresh_token } = result;

		return new Session({
			user_id,
			session_id,
			session_token,
			refresh_token
		});
	}
}
