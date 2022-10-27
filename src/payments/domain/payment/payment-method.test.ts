import { randomUUID } from 'crypto';
import { User } from '@/users/domain';
import { Payment } from './namespace';
import { CashMethod, CreditCard, DebitCard } from './payment-method';

describe('Domain > Payment Method', function () {
	describe('CashMethod', function () {
		test('should instantiate with correct model', function () {
			const account_id_mock = randomUUID();
			const user_id_mock = randomUUID();

			const cash = new CashMethod({
				name: 'Dinheiro',
				user: { id: user_id_mock } as User
			});

			expect(cash.id).not.toBeUndefined();
			expect(cash.type).toBe(Payment.Type.CASH);
			expect(cash.limit).toBeNull();
			expect(cash.readable_limit).toBeNull();
			expect(cash.brand).toBeNull();
			expect(cash.account_id).toBe(account_id_mock);
			expect(cash.user_id).toBe(user_id_mock);
		});
	});

	describe('CreditCard', function () {
		test('should instantiate with correct model', function () {
			const expect_limit = 1134001;
			const expect_brand = Payment.Brand.ELO;
			const account_id_mock = randomUUID();
			const user_id_mock = randomUUID();

			const credit_card = new CreditCard({
				name: 'Bradesco Grafite',
				limit: expect_limit,
				brand: expect_brand,
				user: { id: user_id_mock } as User
			});

			expect(credit_card.id).not.toBeUndefined();
			expect(credit_card.type).toBe(Payment.Type.CREDIT);
			expect(credit_card.limit).toBe(expect_limit);
			expect(credit_card.readable_limit).toBe('R$ 11.340,01');
			expect(credit_card.brand).toBe(expect_brand);
			expect(credit_card.account_id).toBe(account_id_mock);
			expect(credit_card.user_id).toBe(user_id_mock);
		});

		test('should fail when give invalid props', function () {
			const account_id_mock = randomUUID();
			const user_id_mock = randomUUID();

			const base = {
				user: { id: user_id_mock } as User,
				account_id: account_id_mock
			};

			// it will throw the same error if limit is 0 (zero)
			const should_have_limit = () =>
				new CreditCard({ name: 'Empty limit err', ...base });
			const should_have_brand = () =>
				new CreditCard({
					name: 'Without brand err',
					limit: 1,
					...base
				});

			expect(should_have_limit).toThrowError(
				'Credit cards should have limit'
			);
			expect(should_have_brand).toThrowError(
				'Credit cards should have a brand'
			);
		});
	});

	describe('DebitCard', function () {
		test('should instantiate with correct model', function () {
			const account_id_mock = randomUUID();
			const user_id_mock = randomUUID();

			const debit_card = new DebitCard({
				name: 'Bradesco Exclusive',
				limit: 1134001,
				brand: Payment.Brand.ELO,
				user: { id: user_id_mock } as User
			});

			expect(debit_card.id).not.toBeUndefined();
			expect(debit_card.type).toBe(Payment.Type.DEBIT);
			expect(debit_card.limit).toBeNull();
			expect(debit_card.readable_limit).toBeNull();
			expect(debit_card.brand).toBe(Payment.Brand.ELO);
			expect(debit_card.account_id).toBe(account_id_mock);
			expect(debit_card.user_id).toBe(user_id_mock);
		});

		test('should fail when give invalid props', function () {
			const account_id_mock = randomUUID();
			const user_id_mock = randomUUID();

			const base = {
				user: { id: user_id_mock } as User,
				account_id: account_id_mock
			};

			const should_have_brand = () =>
				new DebitCard({ name: 'Without brand err', ...base });

			expect(should_have_brand).toThrowError(
				'Debit cards should have a brand'
			);
		});
	});
});
