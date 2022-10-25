import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserDTO {
	@Expose()
	@ApiProperty({ example: '11f7c925-2cff-4522-9c75-8f6c288fe722' })
	id: string;

	@Expose()
	@ApiProperty({ example: 'John Doe' })
	name: string;

	@Expose()
	@ApiProperty({ example: 'john@doe.com' })
	email: string;
}
