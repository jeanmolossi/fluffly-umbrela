import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session, Sessions } from '@/auth/domain';
import { SessionModel } from './session.entity';

@Injectable()
export class CreateSessionRepository implements Sessions.CreateRepository {
	constructor(
		@InjectRepository(SessionModel)
		private readonly sessionRepository: Repository<SessionModel>
	) {}

	async run(session: Session): Promise<Session> {
		const isset_session = await this.sessionAlreadyExists(session.user_id);
		if (isset_session) return isset_session;

		const orm_session = this.sessionRepository.create({
			user_id: session.user_id,
			session_id: session.id,
			refresh_token: session.refresh_token,
			session_token: session.session_token
		});

		const { user_id, session_id, session_token, refresh_token } =
			await this.sessionRepository.save(orm_session);

		return new Session({
			user_id,
			session_id,
			session_token,
			refresh_token
		});
	}

	async sessionAlreadyExists(user_id: string) {
		const result = await this.sessionRepository.findOneBy({ user_id });
		if (!result) return null;

		const { session_id, session_token, refresh_token } = result;

		return new Session({
			user_id,
			session_id,
			session_token,
			refresh_token
		});
	}
}
