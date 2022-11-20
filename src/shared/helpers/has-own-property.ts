export function hasOwnProperty<
	O extends Record<string, any>,
	K extends keyof O
>(obj: O, param: K) {
	return Object.prototype.hasOwnProperty.call(obj, param);
}
