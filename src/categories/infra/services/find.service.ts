import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Categories, Category } from '@/categories/domain';
import { get_pages } from '@/shared/helpers/get-pages';
import { BaseFilters } from '@/shared/infra/repositories/base.filters';
import { User } from '@/users/domain';
import { CategoryListDTO } from '../dto/category-list.dto';
import { CategoryDTO } from '../dto/category.dto';
import { FindCategoryRepository } from '../repositories/find.repository';

@Injectable()
export class FindMyCategoriesService {
	constructor(
		@Inject(FindCategoryRepository)
		private readonly find: Categories.FindRepository
	) {}

	async run(
		user: User,
		filters: BaseFilters<Categories.Model, Categories.Relations>
	): Promise<CategoryListDTO> {
		const { categories, total } = await this.find.run(
			{ user: { id: user.id } as User },
			filters
		);

		return plainToClass(CategoryListDTO, {
			categories: this.get_categories_dto(categories),
			meta: get_pages('categories', total, filters)
		});
	}

	private get_categories_dto(categories: Category[]): CategoryDTO[] {
		const apply = (category: Category) =>
			plainToClass(CategoryDTO, category);

		return categories.map(apply);
	}
}
