import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categories, Category } from '@/categories/domain';
import { BaseFilters } from '@/shared/infra/repositories/base.filters';
import { BaseRepository } from '@/shared/infra/repositories/base.repository';
import { CategoryModel } from './category.entity';
import { arrayModelToDomain } from './category.mapper';

export class FindCategoryRepository
	extends BaseRepository
	implements Categories.FindRepository
{
	constructor(
		@InjectRepository(CategoryModel)
		private readonly categoriesRepository: Repository<CategoryModel>
	) {
		super();
	}

	async run(
		filter: Partial<Categories.Model>,
		filters: BaseFilters<Categories.Model, Categories.Relations>
	): Promise<{ categories: Category[]; total: number }> {
		const where = this.options<CategoryModel>(filter, filters);

		const [categories, total] =
			await this.categoriesRepository.findAndCount({
				...where,
				cache: {
					id: `categories-${filter.user?.id}`,
					milliseconds: 1000 * 60 * 5 // 5 minute
				}
			});

		return { categories: arrayModelToDomain(categories), total };
	}
}
