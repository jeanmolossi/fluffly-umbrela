import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sessions } from '@/auth/domain';
import { SessionModel } from './session.entity';

@Injectable()
export class DeleteSessionRepository implements Sessions.DeleteRepository {
	constructor(
		@InjectRepository(SessionModel)
		private readonly sessionRepository: Repository<SessionModel>
	) {}

	async run(session_id: string): Promise<boolean> {
		const { affected } = await this.sessionRepository.delete(session_id);

		return affected > 0;
	}
}
