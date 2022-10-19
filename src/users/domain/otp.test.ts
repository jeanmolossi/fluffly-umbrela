import { OTP } from './otp';

describe('Domain > OTP', function () {
	test('should generate an hmac', function () {
		const want = {
			email: 'john@doe.com',
			otp: 123456,
			timestamp: Date.now() + 1000 * 60 * 60 // 1 hour at future,
		};

		const otp = new OTP({ ...want });
		expect(otp.generate()).not.toBeFalsy();
	});

	test('should validate hmac', function () {
		const want = {
			email: 'john@doe.com',
			otp: 123456,
			timestamp: Date.now() + 1000 * 60 * 60 // 1 hour at future,
		};

		const otp = new OTP({ ...want });
		const hash = otp.generate();

		expect(otp.isValid(hash)).toBe(true);
	});

	test('should return false to expired hmac', function () {
		const want = {
			email: 'john@doe.com',
			otp: 123456,
			timestamp: Date.now() - 1000 * 60 * 60 // 1 hour at future,
		};

		const otp = new OTP({ ...want });
		const hash = otp.generate();

		expect(otp.isValid(hash)).toBe(false);
	});
});
