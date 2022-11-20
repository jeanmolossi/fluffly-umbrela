import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hasOwnProperty } from '@/shared/helpers/has-own-property';

export const table_name = 'UsersSessions';

@Injectable()
export class DynamoDBRepository {
	private client_instance: DynamoDBClient;

	constructor(private readonly configService: ConfigService) {
		this.client_instance = this.getDynamoClient();

		const fails = runMigrations(this.getDynamoClient(), this.getClient());
		if (fails.length > 0) {
			fails.map(console.log);
			throw new Error('fail running migrations');
		}
	}

	private getDynamoClient() {
		if (typeof this.client_instance === 'undefined') {
			const region = this.configService.get('REGION');
			const access_key_id = this.configService.get('AWS_ACCESS_KEY_ID');
			const secret_access_key = this.configService.get(
				'AWS_SECRET_ACCESS_KEY'
			);
			const endpoint = this.configService.get('DYNAMO_ENDPOINT');

			this.client_instance = new DynamoDBClient({
				region,
				credentials: {
					accessKeyId: access_key_id,
					secretAccessKey: secret_access_key
				},
				endpoint
			});
		}

		return this.client_instance;
	}

	public getClient() {
		return DynamoDBDocumentClient.from(this.getDynamoClient(), {
			marshallOptions: {
				removeUndefinedValues: true
			}
		});
	}
}

const migrations: Record<string, MigrationFn<any>> = {};

type MigrationFn<T> = (
	dynamo_client: DynamoDBClient,
	doc_client: DynamoDBDocumentClient
) => Promise<T> | T;

export function setMigration<T>(
	migration_name: string,
	migrationCb: MigrationFn<T>
) {
	if (hasOwnProperty(migrations, migration_name)) {
		console.log(`${migration_name} already in use`);
		return;
	}

	migrations[migration_name] = migrationCb;
}

function runMigrations(
	dynamo_client: DynamoDBClient,
	doc_client: DynamoDBDocumentClient
) {
	const fails = [];

	Object.keys(migrations).forEach(async migration => {
		try {
			const cb = migrations[migration];
			await cb(dynamo_client, doc_client);
		} catch (e) {
			fails.push(migration, e);
		}
	});

	return fails;
}
