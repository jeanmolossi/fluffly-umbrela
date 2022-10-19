import { Payment } from './namespace';
import { CashMethod, CreditCard, DebitCard } from './payment-method';

describe('Domain > Payment Method', function () {
	describe('CashMethod', function () {
		test('should instantiate with correct model', function () {
			const cash = new CashMethod({ name: 'Dinheiro' });

			expect(cash.id).not.toBeUndefined();
			expect(cash.type).toBe(Payment.Type.CASH);
			expect(cash.limit).toBeNull();
			expect(cash.readable_limit).toBeNull();
			expect(cash.brand).toBeNull();
		});
	});

	describe('CreditCard', function () {
		test('should instantiate with correct model', function () {
			const expect_limit = 1134001;
			const expect_brand = Payment.Brand.ELO;

			const cash = new CreditCard({
				name: 'Bradesco Grafite',
				limit: expect_limit,
				brand: expect_brand
			});

			expect(cash.id).not.toBeUndefined();
			expect(cash.type).toBe(Payment.Type.CREDIT);
			expect(cash.limit).toBe(expect_limit);
			expect(cash.readable_limit).toBe('R$ 11.340,01');
			expect(cash.brand).toBe(expect_brand);
		});

		test('should fail when give invalid props', function () {
			// it will throw the same error if limit is 0 (zero)
			const should_have_limit = () =>
				new CreditCard({ name: 'Empty limit err' });
			const should_have_brand = () =>
				new CreditCard({ name: 'Without brand err', limit: 1 });

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
			const cash = new DebitCard({
				name: 'Bradesco Exclusive',
				limit: 1134001,
				brand: Payment.Brand.ELO
			});

			expect(cash.id).not.toBeUndefined();
			expect(cash.type).toBe(Payment.Type.DEBIT);
			expect(cash.limit).toBeNull();
			expect(cash.readable_limit).toBeNull();
			expect(cash.brand).toBe(Payment.Brand.ELO);
		});

		test('should fail when give invalid props', function () {
			const should_have_brand = () =>
				new DebitCard({ name: 'Without brand err' });

			expect(should_have_brand).toThrowError(
				'Debit cards should have a brand'
			);
		});
	});
});
