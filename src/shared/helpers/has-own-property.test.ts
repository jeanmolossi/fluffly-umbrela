import { hasOwnProperty } from './has-own-property';

describe('Helpers > hasOwnProperty', function () {
	test('should return true if has property on object', function () {
		const obj = { prop: true };

		expect(hasOwnProperty(obj, 'prop')).toBe(true);
	});
});
