export function addMilliseconds(_in: Date, milliseconds: number): Date {
	const now = new Date();

	_in.setMilliseconds(now.getMilliseconds() + milliseconds);

	return _in;
}

export function addMinutes(_in: Date, minutes: number): Date {
	const now = new Date();

	_in.setMinutes(now.getMinutes() + minutes);

	return _in;
}

type Hours = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type StrChar = 's' | 'm' | 'h' | 'd';

type TimeStr = `${Hours}${StrChar}`;

export const time_ref: Record<StrChar, number> = {
	s: 1000, // 1 second
	m: 1000 * 60, // 1 minute
	h: 1000 * 60 * 60, // 1 hour,
	d: 1000 * 60 * 60 * 24 // 1 day
};

export function parseToMs(time_str: TimeStr): number {
	const { groups } = time_str.match(
		/^((?<time>\d+)(?<str_char>[a-zA-Z]{1})?)$/
	);

	const { time: time_str_gr, str_char } = groups;

	if (!str_char && !time_str_gr) throw new Error('provide valid time string');

	const time = Number(time_str_gr);

	if (isNaN(time)) {
		throw new Error('can not parse time as number');
	}

	if (!str_char && time > 0) {
		return time;
	}

	return time_ref[str_char] * time;
}
