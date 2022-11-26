/* eslint-disable @typescript-eslint/naming-convention */

import { parseToMs, time_ref } from './helpers/date-math';

export default {
	AUTH_TOKEN: 'access_token',
	AUTH_EXPIRES_IN:
		parseToMs((process.env.ACCESS_TOKEN_EXPIRES as any) ?? '15m') /
		time_ref['m'],
	REFRESH_TOKEN: 'refresh_token',
	REFRESH_EXPIRES_IN:
		parseToMs((process.env.REFRESH_TOKEN_EXPIRES as any) ?? '7d') /
		time_ref['m'],
	BASE_HOST: process.env.BASE_HOST ?? 'http://localhost:3000'
};
