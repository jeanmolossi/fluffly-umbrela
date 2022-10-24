import { randomUUID } from 'crypto';
import { Transactions } from './namespace';
import { Transaction } from './transaction';

describe('Domain > Transaction', function () {
	test('should instantiate a transaction properly', function () {
		const category_id_mock = randomUUID();
		const wallet_id_mock = randomUUID();
		const user_id_mock = randomUUID();
		const value_mock = 1998;

		const transaction = new Transaction({
			reference: 'Uber',
			category_id: category_id_mock,
			wallet_id: wallet_id_mock,
			user_id: user_id_mock,
			value: value_mock
		});

		expect(transaction.id).not.toBeUndefined();
		expect(transaction.reference).toBe('Uber');
		expect(transaction.category_id).toBe(category_id_mock);
		expect(transaction.wallet_id).toBe(wallet_id_mock);
		expect(transaction.type).toBe(Transactions.Type.EXPENSE);
		expect(transaction.user_id).toBe(user_id_mock);
		expect(transaction.value).toBe(value_mock);
		expect(transaction.value_fmt).toBe('R$ 19,98');
	});

	test('should fails trying instance invalid transaction', function () {
		const test_case: { [k: string]: Transactions.Model } = {
			should_have_reference: {
				reference: null,
				category_id: randomUUID(),
				wallet_id: randomUUID(),
				user_id: randomUUID(),
				value: 1990
			},
			should_have_category: {
				reference: 'ref',
				category_id: null,
				wallet_id: randomUUID(),
				user_id: randomUUID(),
				value: 1990
			},
			should_have_wallet: {
				reference: 'ref',
				category_id: randomUUID(),
				wallet_id: null,
				user_id: randomUUID(),
				value: 1990
			},
			should_have_value: {
				reference: 'ref',
				category_id: randomUUID(),
				wallet_id: randomUUID(),
				user_id: randomUUID(),
				value: 0
			},
			value_should_be_int: {
				reference: 'ref',
				category_id: randomUUID(),
				wallet_id: randomUUID(),
				user_id: randomUUID(),
				value: 0.1
			}
		};

		const should_have_reference = () =>
			new Transaction({ ...test_case.should_have_reference });
		const should_have_category = () =>
			new Transaction({ ...test_case.should_have_category });
		const should_have_wallet = () =>
			new Transaction({ ...test_case.should_have_wallet });
		const should_have_value = () =>
			new Transaction({ ...test_case.should_have_value });
		const value_should_be_int = () =>
			new Transaction({ ...test_case.value_should_be_int });

		expect(should_have_reference).toThrowError(
			'All transactions should have a reference'
		);
		expect(should_have_category).toThrowError(
			'You should provide a transaction category'
		);
		expect(should_have_wallet).toThrowError(
			'You should provide a wallet from transaction'
		);
		expect(should_have_value).toThrowError(
			'Value from transaction should be valid value'
		);
		expect(value_should_be_int).toThrowError(
			'Value should be a safe integer'
		);
	});
});
