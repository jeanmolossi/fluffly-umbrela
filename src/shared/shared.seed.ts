import { config } from 'dotenv';
import path from 'path';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from "typeorm";
import { runSeeders, SeederOptions } from "typeorm-extension";

config({ path: path.resolve(__dirname, '..', '..', '.env.development.local')})

const options: DataSourceOptions & SeederOptions = {
	type: 'postgres',
	host: 'localhost',
	port: +process.env.DB_PORT,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	entities: [
		__dirname + '/../**/repository/*.entity.{ts,js}',
		__dirname + '/../**/repositories/*.entity.{ts,js}',
	],
	seeds: [__dirname + '/*.seeder.{ts,js}'],
	factories: [
		__dirname + '/../**/repository/*.factory.{ts,js}',
		__dirname + '/../**/repositories/*.factory.{ts,js}',
	],
}

const dataSource = new DataSource(options)

dataSource.initialize().then(async () => {
	await runSeeders(dataSource);
	process.exit()
})
