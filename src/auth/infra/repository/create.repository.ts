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

		if (isset_session) {
			isset_session.refresh = isset_session.refresh ?? session.refresh;
			return isset_session;
		}

		const { user_id, id, token, created_at } =
			await this.sessionRepository.create({
				id: session.id,
				user_id: session.user_id,
				token: session.token,
				created_at: session.created_at
			});

		return new Session({
			id,
			user_id,
			token,
			created_at,
			refresh: session?.refresh
		});
	}

	async sessionAlreadyExists(user_id: string, session_id: string) {
		const result = await this.sessionRepository.findOneBy({
			id: session_id,
			user_id
		});

		if (!result) return null;

		const { token, created_at } = result;

		return new Session({
			user_id,
			id: session_id,
			token,
			created_at
		});
	}
}
