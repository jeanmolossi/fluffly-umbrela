import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions
} from 'class-validator';

export function EqualsField(
	fieldName: string,
	validationOptions?: ValidationOptions
) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'equalsField',
			async: false,
			target: object.constructor,
			propertyName,
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {
					const compare_field = args.object[fieldName];

					return value === compare_field;
				},
				defaultMessage(args: ValidationArguments) {
					return `Field ${args.property} should match with ${fieldName}`;
				}
			}
		});
	};
}
