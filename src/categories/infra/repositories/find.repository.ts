import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categories, Category } from '@/categories/domain';
import { CategoryModel } from './category.entity';
import { arrayModelToDomain } from './category.mapper';

export class FindCategoryRepository implements Categories.FindRepository {
	constructor(
		@InjectRepository(CategoryModel)
		private readonly categoriesRepository: Repository<CategoryModel>
	) {}

	async run(
		filter: Partial<Categories.Model>,
		page?: number,
		per_page?: number
	): Promise<{ categories: Category[]; total: number }> {
		const [categories, total] =
			await this.categoriesRepository.findAndCount({
				where: filter,
				cache: {
					id: 'categories',
					milliseconds: 1000 * 60 // 1 minute
				},
				take: per_page,
				skip: this.offset(page, per_page)
			});

		return { categories: arrayModelToDomain(categories), total };
	}

	private offset(page: number = 1, per_page: number = 15): number {
		return (page - 1) * per_page;
	}
}
