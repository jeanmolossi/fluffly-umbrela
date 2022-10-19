export function capitalize(s: string): string {
	const words = s.split(/[\s_-]+/gi);
	const capitalized_words = words.map(ucFirst);
	return capitalized_words.join(' ');
}

export function ucFirst(s: string): string {
	const initial = s.charAt(0).toUpperCase();
	const rest = s.substring(1, s.length).toLowerCase();

	return `${initial}${rest}`;
}
