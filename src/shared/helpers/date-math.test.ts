import { addMilliseconds, addMinutes, parseToMs, time_ref } from './date-math';

jest.useFakeTimers().setSystemTime(new Date('2022-01-01'));

type DateChild = {
	yyyy?: string;
	m?: string;
	d?: string;
	h?: string;
	i?: string;
	s?: string;
	ns?: string;
};

const base_string = ({
	yyyy = '2022',
	m = '01',
	d = '01',
	h = '00',
	i = '00',
	s = '00',
	ns = '000'
}: DateChild) => {
	return `${yyyy}-${m}-${d}T${h}:${i}:${s}.${ns}Z`;
};

describe('Helpers > Date Math', function () {
	test('should add minutes properly', function () {
		const test_cases = [
			{
				test_date: new Date(),
				time_to_add: 10, // 10 minutes
				want_before_add: base_string({ i: '00' }), // 2022-01-01T00:00:00.000Z
				want_after_add: base_string({ i: '10' }) // 2022-01-01T00:10:00.000Z
			},
			{
				test_date: new Date(),
				time_to_add: 70, // 70 minutes
				want_before_add: base_string({ h: '00', i: '00' }), // 2022-01-01T00:00:00.000Z
				want_after_add: base_string({ h: '01', i: '10' }) // 2022-01-01T01:10:00.000Z
			},
			{
				test_date: new Date(),
				time_to_add: -10, // back 10 minutes
				want_before_add: base_string({}), // 2022-01-01T00:00:00.000Z
				want_after_add: base_string({
					yyyy: '2021',
					m: '12',
					d: '31',
					h: '23',
					i: '50'
				}) // 2021-12-31T23:50:00.000Z
			}
		];

		for (let i = 0; i < test_cases.length; i++) {
			const { test_date, time_to_add, want_after_add, want_before_add } =
				test_cases[i];

			expect(test_date.toISOString()).toBe(want_before_add);

			addMinutes(test_date, time_to_add);

			expect(test_date.toISOString()).toBe(want_after_add);
		}
	});

	test('should add milliseconds properly', function () {
		const test_date = new Date();

		expect(test_date.toISOString()).toBe('2022-01-01T00:00:00.000Z');
		addMilliseconds(test_date, 500);
		expect(test_date.toISOString()).toBe('2022-01-01T00:00:00.500Z');
	});
});

describe('Helpers > parseToMs', function () {
	test('should parse dates to correct ms time', function () {
		const test_cases: Record<any, any> = [
			{ time_str: '15s', expected: time_ref['s'] * 15 },
			{ time_str: '20m', expected: time_ref['m'] * 20 },
			{ time_str: '25h', expected: time_ref['h'] * 25 },
			{ time_str: '30d', expected: time_ref['d'] * 30 }
		];

		test_cases.forEach(({ time_str, expected }) => {
			expect(parseToMs(time_str)).toBe(expected);
		});
	});
});
