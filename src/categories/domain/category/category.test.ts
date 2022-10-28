import { randomUUID } from 'crypto';
import { User } from '@/users/domain';
import { Category } from './category';

describe('Domain > Category', function () {
	test('should instantiate an category correctly', function () {
		const user_id = randomUUID();
		const category = new Category({
			name: 'Transporte',
			user: { id: user_id } as User
		});

		expect(category.id).not.toBeUndefined();
		expect(category.name).toBe('Transporte');
		expect(category.user_id).toBe(user_id);
	});
});
