import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsUUID, IsNotEmpty, IsOptional } from 'class-validator';
import { Categories } from '@/categories/domain';

export class AddCategory implements Categories.Model {
	@ApiProperty({ example: 'Transporte' })
	@IsNotEmpty({ message: 'Name should not be empty' })
	name: string;

	@IsOptional()
	@IsUUID('4', { message: 'Parent ID should be valid reference' })
	@ApiPropertyOptional({ example: '4dce34f8-fb70-4d4d-a1d1-6288ac41e9a6' })
	parent_id?: string;

	@Exclude()
	user_id?: string;
}
