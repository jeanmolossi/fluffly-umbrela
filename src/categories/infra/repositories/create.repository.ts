import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categories, Category } from '@/categories/domain';
import { CategoryModel } from './category.entity';
import { CategoryMapper } from './category.mapper';

@Injectable()
export class CreateCategoryRepository implements Categories.CreateRepository {
	constructor(
		@InjectRepository(CategoryModel)
		private readonly repository: Repository<CategoryModel>
	) {}

	async run(category: Category): Promise<Category> {
		const orm_category = this.repository.create(category);
		const saved_category = await this.repository.save(orm_category);

		return CategoryMapper.modelToDomain(saved_category);
	}
}
