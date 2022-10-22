import { Inject, Injectable } from '@nestjs/common';
import { Categories, Category } from '@/categories/domain';
import { ConflictErr, NotFoundErr } from '@/shared/domain/http-errors';
import { AddCategory } from '../adapters/add-category';
import { CreateCategoryRepository } from '../repositories/create.repository';
import { FindOneCategoryRepository } from '../repositories/find-one.repository';

@Injectable()
export class CreateCategoryService {
	constructor(
		@Inject(CreateCategoryRepository)
		private readonly create: Categories.CreateRepository,
		@Inject(FindOneCategoryRepository)
		private readonly findOne: Categories.FindOneRepository
	) {}

	async run(add_category: AddCategory): Promise<Category> {
		const category = new Category(add_category);

		if (await this.category_already_exists(category)) {
			throw new ConflictErr('Category already exists');
		}

		if (category.parent_id) {
			const subcategory_exists = await this.subcategory_exists(
				category.parent_id,
				category.user_id
			);

			if (!subcategory_exists) {
				throw new NotFoundErr('Sub category does not exists');
			}
		}

		return await this.create.run(category);
	}

	private async category_already_exists({
		name,
		user_id
	}: Category): Promise<boolean> {
		const category = await this.findOne.run({ name, user_id });
		return Boolean(category?.id);
	}

	private async subcategory_exists(
		id: string,
		user_id: string
	): Promise<boolean> {
		const subcategory = await this.findOne.run({ id, user_id });
		return Boolean(subcategory?.id);
	}
}
