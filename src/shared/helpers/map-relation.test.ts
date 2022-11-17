import { mapObject, mapRelation } from './map-relation';

describe('helpers > mapRelation', function () {
	test('should map simple object', function () {
		const input = 'wallet.id';
		const want = { wallet: { id: true } };

		expect(mapRelation(input)).toEqual(want);
	});

	test('should map object properly', function () {
		const input = 'wallet.account.id';
		const want = { wallet: { account: { id: true } } };

		expect(mapRelation(input)).toEqual(want);
	});

	test('should map complex object', function () {
		const input = 'wallet.account.user.id';
		const want = { wallet: { account: { user: { id: true } } } };

		expect(mapRelation(input)).toEqual(want);
	});
});

describe('helpers > mapObject', function () {
	test('should map complex object and merge duplicates', function () {
		const inputs = ['wallet.account.id', 'wallet.account.name'];
		const want = { wallet: { account: { id: true, name: true } } };

		const final_object = {};
		inputs.forEach(input => mapObject(final_object, input));

		expect(final_object).toEqual(want);
	});
});
