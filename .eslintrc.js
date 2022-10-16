/* eslint-disable @typescript-eslint/naming-convention */
module.exports = {
	env: {
		es2021: true,
		node: true
	},
	extends: ['google', 'prettier'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module'
	},
	plugins: ['@typescript-eslint', 'prettier'],
	rules: {
		'prettier/prettier': 'error',
		indent: 'off',
		'object-curly-fspacing': 'off',
		'new-cap': 'off',
		'require-jsdoc': 'off',
		camelcase: 'off',
		'@typescript-eslint/naming-convention': [
			'error',
			{
				selector: 'variable',
				format: ['snake_case'],
				leadingUnderscore: 'allow',
				trailingUnderscore: 'allow'
			},
			{
				selector: 'memberLike',
				format: ['snake_case', 'camelCase'],
				leadingUnderscore: 'allow',
				trailingUnderscore: 'allow'
			}
		]
	}
};
