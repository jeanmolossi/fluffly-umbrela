import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config({ path: __dirname + '/../.env.development.local' });

const datasource = new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: +process.env.DB_PORT,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	entities: [
		__dirname + '/../src/**/infra/repository/*.entity.{ts,js}',
		__dirname + '/../src/**/infra/repositories/*.entity.{ts,js}'
	]
});

export default datasource.initialize();
