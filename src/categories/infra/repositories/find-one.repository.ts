import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categories, Category } from '@/categories/domain';
import { CategoryModel } from './category.entity';
import { CategoryMapper } from './category.mapper';

@Injectable()
export class FindOneCategoryRepository implements Categories.FindOneRepository {
	constructor(
		@InjectRepository(CategoryModel)
		private readonly repository: Repository<CategoryModel>
	) {}

	async run(filter: Partial<Categories.Model>): Promise<Category> {
		const category = await this.repository.findOneBy(filter);

		if (!category) return null;

		return CategoryMapper.modelToDomain(category);
	}
}
