/* eslint-disable @typescript-eslint/naming-convention */
import { faker } from '@faker-js/faker';
import { RegisterUser } from '@/users/infra/adapters/register-user';
import { cli, println } from './cli';

function mockUser(user: Partial<RegisterUser> = {}) {
	const fake_user = new RegisterUser();

	fake_user.name = faker.name.fullName();
	fake_user.email = faker.internet.email();
	fake_user.password = '123456';
	fake_user.confirm_password = '123456';

	Object.assign(fake_user, user);

	return fake_user;
}

type UserCliSeed = {
	users: number;
};

async function bootstrap() {
	const { users } = cli<UserCliSeed>({
		schema: { users: Number },
		required: ['users']
	});

	const root_user = mockUser({ email: 'test@test.com' });

	const users_seed = Array.from({ length: users }).map(
		mockUser.bind(mockUser)
	);

	users_seed[0] = root_user;
	const seed_route = `http://127.0.0.1:3001`;

	const promises = users_seed.map(async seed => {
		return await fetch(`${seed_route}/users`, {
			method: 'POST',
			body: JSON.stringify(seed),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(r => r.json());
	});

	const result = await Promise.all(promises);
	result.map(println.debug);
	println.info(`${result.length} resultados`);
}

bootstrap();
