/* eslint-disable @typescript-eslint/naming-convention */
import {
	GetCommand,
	GetCommandInput,
	PutCommand,
	PutCommandInput,
	DeleteCommand,
	DeleteCommandInput
} from '@aws-sdk/lib-dynamodb';
import { Inject, Injectable } from '@nestjs/common';
import { InternalServerErr } from '@/shared/domain/http-errors';
import { hasOwnProperty } from '@/shared/helpers/has-own-property';
import { SessionModel } from '../session.entity';
import { DynamoDBRepository, table_name } from './dynamodb.repository';

@Injectable()
export class DynamoDBRepositoryAdapter {
	constructor(
		@Inject(DynamoDBRepository)
		private readonly repository: DynamoDBRepository
	) {}

	async create(session: SessionModel): Promise<SessionModel> {
		if (!this.has_partition_keys(session))
			throw new InternalServerErr('You must provide partition keys');

		const input: PutCommandInput = {
			Item: {
				UserID: session.user_id,
				ID: session.session_id,
				SessionToken: session.session_token,
				RefreshToken: session.refresh_token,
				CreatedAt: new Date().getTime()
			},
			TableName: table_name
		};

		try {
			const result = await this.repository
				.getClient()
				.send(new PutCommand(input));

			const { $metadata } = result;

			if ($metadata.httpStatusCode !== 200) {
				throw new InternalServerErr('can not create session');
			}

			return session;
		} catch (e) {
			console.log(e);
			// re-throw error
			throw new InternalServerErr('can not create session');
		}
	}

	async delete(
		session: Partial<SessionModel>
	): Promise<{ affected: number }> {
		if (!this.has_partition_keys(session)) {
			throw new InternalServerErr('You must provide partition keys');
		}

		const input: DeleteCommandInput = {
			TableName: table_name,
			Key: {
				ID: session.session_id,
				UserID: session.user_id
			}
		};

		try {
			await this.repository.getClient().send(new DeleteCommand(input));

			return { affected: 1 };
		} catch (e) {
			console.log(e);
			throw e;
		}
	}

	async findOneBy(
		session: Partial<SessionModel>
	): Promise<SessionModel | undefined> {
		if (!this.has_partition_keys(session)) return;

		const input: GetCommandInput = {
			Key: {
				UserID: session.user_id,
				ID: session.session_id
			},
			TableName: table_name
		};

		const { $metadata, Item } = await this.repository
			.getClient()
			.send(new GetCommand(input));

		if ($metadata.httpStatusCode !== 200 || !Item) {
			return;
		}

		const sessionModel = new SessionModel();

		sessionModel.session_id = Item.ID;
		sessionModel.user_id = Item.UserID;
		sessionModel.session_token = Item.SessionToken;
		sessionModel.refresh_token = Item.RefreshToken;

		return sessionModel;
	}

	private has_partition_keys(session: Partial<SessionModel>): boolean {
		if (
			!hasOwnProperty(session, 'user_id') ||
			!hasOwnProperty(session, 'session_id')
		) {
			return false;
		}

		return true;
	}
}
