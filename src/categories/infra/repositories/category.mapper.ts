import { Category } from '@/categories/domain';
import { TransactionMapper } from '@/transactions/infra/repositories/transactions.mapper';
import { UserMapper } from '@/users/infra/repository/user.mapper';
import { CategoryModel } from './category.entity';

export class CategoryMapper {
	static modelToDomain(category: CategoryModel): Category {
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
			user: UserMapper.modelToDomain(user),
			parent: this.modelToDomain(parent),
			sub_categories: this.arrayModelToDomain(sub_categories),
			name,
			transactions: TransactionMapper.arrayModelToDomain(transactions),
			created_at,
			updated_at
		});
	}

	static arrayModelToDomain(categories: CategoryModel[]): Category[] {
		return categories?.map(this.modelToDomain);
	}
}
