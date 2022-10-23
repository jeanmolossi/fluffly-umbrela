import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { MetaDTO } from '@/shared/infra/dto/meta.dto';
import { CategoryDTO } from './category.dto';

export class CategoryListDTO {
	@Expose()
	@ApiProperty({ type: CategoryDTO, isArray: true })
	categories: CategoryDTO[];

	@Expose()
	@ApiProperty({ type: MetaDTO })
	meta: MetaDTO;
}
