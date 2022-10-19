import { Category } from './category';

describe('Domain > Category', function () {
	test('should instantiate an category correctly', function () {
		const category = new Category({ name: 'Transporte' });

		expect(category.id).not.toBeUndefined();
		expect(category.name).toBe('Transporte');
	});
});
