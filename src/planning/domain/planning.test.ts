import { randomUUID } from 'crypto';
import { Planning } from './planning';

describe('Domain > Planning', function () {
	test('should instantiate properly', function () {
		const planning = new Planning({
			reference: 'Alimentação',
			category_filters: [randomUUID(), randomUUID()],
			limit: 160000
		});

		expect(planning.id).not.toBeUndefined();
		expect(planning.reference).toBe('Alimentação');
		expect(planning.category_filters).toHaveLength(2);
		expect(planning.limit).toBe(160000);
		expect(planning.readable_limit).toBe('R$ 1.600,00');
	});

	test('should fail in invalid planning model', function () {
		const test_cases: { [k: string]: Planning.Model } = {
			should_have_reference: {
				reference: null,
				category_filters: [randomUUID()],
				limit: 1
			},
			should_have_limit: {
				reference: 'ref',
				category_filters: [randomUUID()],
				limit: 0
			},
			start_should_be_valid: {
				reference: 'ref',
				category_filters: [randomUUID()],
				limit: 1,
				start_at: 1e16
			},
			should_have_categories: {
				reference: 'ref',
				category_filters: [],
				limit: 1
			}
		};

		const should_have_reference = () =>
			new Planning({ ...test_cases.should_have_reference });
		const should_have_limit = () =>
			new Planning({ ...test_cases.should_have_limit });
		const start_should_be_valid = () =>
			new Planning({ ...test_cases.start_should_be_valid });
		const should_have_categories = () =>
			new Planning({ ...test_cases.should_have_categories });

		expect(should_have_reference).toThrowError(
			'A planning should have a reference'
		);
		expect(should_have_limit).toThrowError(
			'A planning should have a budget limit'
		);
		expect(start_should_be_valid).toThrowError(
			'The start date from planning should be between 1 - 31'
		);
		expect(should_have_categories).toThrowError(
			'The planning should have at least one category as filter'
		);
	});
});
