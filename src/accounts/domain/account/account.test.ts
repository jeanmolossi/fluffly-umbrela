import { randomUUID } from 'crypto';
import { Account } from './account';

describe('Domain > Account', function () {
	test('should instantiate with default values', function () {
		const user_id_mock = randomUUID();
		const account = new Account({
			name: 'Dinheiro',
			user_id: user_id_mock
		});

		expect(account.id).not.toBeUndefined();
		expect(account.user_id).toBe(user_id_mock);
		expect(account.name).toBe('Dinheiro');
		expect(account.initial_amount).toBe(0);
		expect(account.bank_id).toBe(1);
		expect(account.bank_name).toBe('Carteira');
	});

	test('should update initial amount', function () {
		const user_id_mock = randomUUID();
		const account = new Account({
			name: 'Dinheiro',
			user_id: user_id_mock
		});

		expect(account.initial_amount).toBe(0);

		account.updateInitialAmount(100);

		expect(account.user_id).toBe(user_id_mock);
		expect(account.initial_amount).not.toBe(0);
		expect(account.initial_amount).toBe(100);
	});

	test('should fail update if invalid amount', function () {
		const user_id_mock = randomUUID();
		const account = new Account({
			name: 'Dinheiro',
			user_id: user_id_mock
		});

		expect(account.user_id).toBe(user_id_mock);
		expect(account.initial_amount).toBe(0);

		expect(() => account.updateInitialAmount(1.1)).toThrowError(
			'Amount should be integer (cents value)'
		);
		expect(() => account.updateInitialAmount(1e16)).toThrowError(
			'Invalid amount'
		);
	});
});
