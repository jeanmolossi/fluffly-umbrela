import { Category } from '@/categories/domain';
import { arrayModelToDomain as arrayTransactionModelToDomain } from '@/transactions/infra/repositories/transactions.mapper';
import { modelToDomain as userModelToDomain } from '@/users/infra/repository/user.mapper';
import { CategoryModel } from './category.entity';

export function modelToDomain(category: CategoryModel): Category {
	if (!category?.id) return;

	const {
		id,
		user,
		parent,
		sub_categories,
		name,
		transactions,
		created_at,
		updated_at
	} = category;

	return new Category({
		id,
		user: userModelToDomain(user),
		parent: modelToDomain(parent),
		sub_categories: arrayModelToDomain(sub_categories),
		name,
		transactions: arrayTransactionModelToDomain(transactions),
		created_at,
		updated_at
	});
}

export function arrayModelToDomain(categories: CategoryModel[]): Category[] {
	return categories?.map(modelToDomain);
}
