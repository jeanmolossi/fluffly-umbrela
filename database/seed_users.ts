/* eslint-disable @typescript-eslint/naming-convention */
import { faker } from '@faker-js/faker';
import { User } from '@/users/domain';
import { UserModel } from '@/users/infra/repository/user.entity';
import { UserMapper } from '@/users/infra/repository/user.mapper';
import { println } from './cli';
import data_source from './data_source';

function mockUser(user: Partial<User> = {}) {
	const fake_user = new User({
		name: faker.name.fullName(),
		email: faker.internet.email(),
		password: '123456',
		...user
	});

	fake_user.encryptPassword();

	return UserMapper.domainToModel(fake_user);
}

export default async function bootstrap({ amount }) {
	println.info('seed de usuários iniciado');
	const user_values = Array.from({ length: amount }).map(mockUser);
	const root_user = mockUser({ email: 'test@test.com' });
	user_values[0] = root_user;

	const db = await data_source;

	return await db
		.createQueryBuilder()
		.insert()
		.into(UserModel)
		.values(user_values)
		.execute()
		.then(r => {
			println.info('seed de usuários finalizado');
			return r;
		});
}
