export function capitalize(s: string): string {
	const words = s.split(/[\s_-]+/gi)
	const capitalizedWords = words.map(ucFirst)
	return capitalizedWords.join(' ')
}

export function ucFirst(s: string): string {
	const initial = s.charAt(0).toUpperCase()
	const rest = s.substring(1, s.length).toLowerCase()

	return `${initial}${rest}`
}
