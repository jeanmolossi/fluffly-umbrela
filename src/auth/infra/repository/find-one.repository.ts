import { Inject, Injectable } from '@nestjs/common';
import { Session, Sessions } from '@/auth/domain';
import { DynamoDBRepositoryAdapter } from './dynamo-adapter/dynamo-adapter.repository';

@Injectable()
export class FindOneSessionRepository implements Sessions.FindOneRepository {
	constructor(
		@Inject(DynamoDBRepositoryAdapter)
		private readonly sessionRepository: DynamoDBRepositoryAdapter
	) {}

	async run(session: Partial<Sessions.Model>): Promise<Session> {
		const isset_session = await this.sessionRepository.findOneBy(session);

		if (!isset_session) return null;

		const { user_id, id, token, created_at } = isset_session;

		return new Session({
			id,
			user_id,
			token,
			created_at
		});
	}
}
