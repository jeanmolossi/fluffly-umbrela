import { Inject, Injectable } from '@nestjs/common';
import { Sessions } from '@/auth/domain';
import { DynamoDBRepositoryAdapter } from './dynamo-adapter/dynamo-adapter.repository';

@Injectable()
export class DeleteSessionRepository implements Sessions.DeleteRepository {
	constructor(
		@Inject(DynamoDBRepositoryAdapter)
		private readonly sessionRepository: DynamoDBRepositoryAdapter
	) {}

	async run(session: Sessions.Info): Promise<boolean> {
		const { affected } = await this.sessionRepository.delete(session);

		return affected > 0;
	}
}
