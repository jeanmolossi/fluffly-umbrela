import { Session, Sessions } from '@/auth/domain';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionModel } from './session.entity';

@Injectable()
export class FindOneSessionRepository implements Sessions.FindOneRepository {
	constructor(
		@InjectRepository(SessionModel)
		private readonly sessionRepository: Repository<SessionModel>
	) {}

	async run(session: Partial<Sessions.Model>): Promise<Session> {
		const isset_session = await this.sessionRepository.findOneBy(session);

		if (!isset_session) return null;

		const { user_id, session_id, session_token, refresh_token } =
			isset_session;

		return new Session({
			user_id,
			session_id,
			session_token,
			refresh_token
		});
	}
}
