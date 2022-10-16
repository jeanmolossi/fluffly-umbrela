import { capitalize, ucFirst } from './capitalize';

describe('Helpers > capitalize', function () {
	test('should upper case first char', function () {
		const text = 'not capitalized';
		expect(ucFirst(text)).toBe('Not capitalized');
	});

	test('should upper case all first chars', function () {
		let text = 'not capitalized';
		expect(capitalize(text)).toBe('Not Capitalized');
		text = 'not-capitalized';
		expect(capitalize(text)).toBe('Not Capitalized');
		text = 'not_capitalized';
		expect(capitalize(text)).toBe('Not Capitalized');
		text = 'not  -- _ _ capitalized';
		expect(capitalize(text)).toBe('Not Capitalized');
	});
});
