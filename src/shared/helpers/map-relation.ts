export function mapRelation(field: string): object {
	const sub_fields = field.split('.');

	const [first_field] = sub_fields.splice(0, 1);

	if (sub_fields.length > 0) {
		return { [first_field]: mapRelation(sub_fields.join('.')) };
	}

	return { [first_field]: true };
}

export function firstObjectKey(field: string): string {
	const sub_fields = field.split('.');
	const [key] = sub_fields.splice(0, 1);
	return key;
}

export function mapObject(select: object, field: string): object {
	const key = firstObjectKey(field);
	const should_merge = Boolean(select[key]);

	if (should_merge) {
		const fields = field.split('.');
		fields.splice(0, 1);

		const without_first_key = fields.join('.');
		return mapObject(select[key], without_first_key);
	}

	Object.assign(select, mapRelation(field));
	return select;
}
