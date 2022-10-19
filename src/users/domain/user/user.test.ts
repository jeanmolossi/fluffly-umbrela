import { User } from './user';

describe('Domain > User', function () {
	test('should instantiate user with correct properties', function () {
		const want = {
			name: 'John Doe',
			email: 'john@email.com',
			password: '123456'
		};

		const user = new User({ ...want });
		user.encrypyPassword();

		expect(user.id).not.toBeUndefined();
		expect(user.name).toBe(want.name);
		expect(user.email).toBe(want.email);
		expect(user.avatar).toContain('https://randomuser.me/api');
		expect(user.password).not.toBe(want.password);
	});
});
