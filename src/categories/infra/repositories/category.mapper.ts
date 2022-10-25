import { Category } from '@/categories/domain';
import { CategoryModel } from './category.entity';

export function modelToDomain(category: CategoryModel): Category {
	if (!category?.id) return;

	const { id, user_id, parent_id, name, created_at, updated_at } = category;

	return new Category({
		id,
		user_id,
		parent_id,
		name,
		created_at,
		updated_at
	});
}

export function arrayModelToDomain(
	categories: CategoryModel[] = []
): Category[] {
	return categories.map(modelToDomain);
}
