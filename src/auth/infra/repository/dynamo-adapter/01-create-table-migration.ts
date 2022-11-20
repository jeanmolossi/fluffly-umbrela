/* eslint-disable @typescript-eslint/naming-convention */

import {
	CreateTableCommand,
	CreateTableCommandInput,
	ResourceInUseException
} from '@aws-sdk/client-dynamodb';
import { Logger } from '@nestjs/common';
import * as util from 'util';
import { setMigration, table_name } from './dynamodb.repository';

const params: CreateTableCommandInput = {
	AttributeDefinitions: [
		{ AttributeName: 'ID', AttributeType: 'S' },
		{ AttributeName: 'UserID', AttributeType: 'S' },
		{ AttributeName: 'CreatedAt', AttributeType: 'N' }
	],
	KeySchema: [
		{ AttributeName: 'UserID', KeyType: 'HASH' },
		{ AttributeName: 'ID', KeyType: 'RANGE' }
	],
	LocalSecondaryIndexes: [
		{
			IndexName: 'CreatedLSI',
			KeySchema: [
				{ AttributeName: 'UserID', KeyType: 'HASH' },
				{ AttributeName: 'CreatedAt', KeyType: 'RANGE' }
			],
			Projection: {
				ProjectionType: 'ALL'
			}
		}
	],
	ProvisionedThroughput: {
		ReadCapacityUnits: 1,
		WriteCapacityUnits: 1
	},
	TableName: table_name
};

setMigration('create_sessions_table', async dynamo_client => {
	try {
		await dynamo_client.send(new CreateTableCommand(params));
	} catch (e) {
		if (e instanceof ResourceInUseException) {
			Logger.warn('Table already created', 'AuthModule');
			return;
		}

		Logger.error(
			util.format('Error ocurred during table create', e),
			'AuthModule'
		);
		throw e;
	}
});
