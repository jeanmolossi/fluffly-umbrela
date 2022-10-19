import { randomUUID } from 'crypto';
import { Transaction, Transactions } from './transaction';

describe('Domain > Transaction', function () {
	test('should instantiate a transaction properly', function () {
		const category_id_mock = randomUUID();
		const wallet_id_mock = randomUUID();

		const transaction = new Transaction({
			reference: 'Uber',
			category_id: category_id_mock,
			wallet_id: wallet_id_mock
		});

		expect(transaction.id).not.toBeUndefined();
		expect(transaction.reference).toBe('Uber');
		expect(transaction.category_id).toBe(category_id_mock);
		expect(transaction.wallet_id).toBe(wallet_id_mock);
		expect(transaction.type).toBe(Transactions.Type.EXPENSE);
	});

	test('should fails trying instance invalid transaction', function () {
		const test_case: { [k: string]: Transactions.Model } = {
			should_have_reference: {
				reference: null,
				category_id: randomUUID(),
				wallet_id: randomUUID()
			},
			should_have_category: {
				reference: 'ref',
				category_id: null,
				wallet_id: randomUUID()
			},
			should_have_wallet: {
				reference: 'ref',
				category_id: randomUUID(),
				wallet_id: null
			}
		};

		const should_have_reference = () =>
			new Transaction({ ...test_case.should_have_reference });
		const should_have_category = () =>
			new Transaction({ ...test_case.should_have_category });
		const should_have_wallet = () =>
			new Transaction({ ...test_case.should_have_wallet });

		expect(should_have_reference).toThrowError(
			'All transactions should have a reference'
		);
		expect(should_have_category).toThrowError(
			'You should provide a transaction category'
		);
		expect(should_have_wallet).toThrowError(
			'You should provide a wallet from transaction'
		);
	});
});
