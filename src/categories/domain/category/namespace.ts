import { BaseFilters } from '@/shared/infra/repositories/base.filters';
import { Transaction } from '@/transactions/domain';
import { User } from '@/users/domain';
import { Category } from './category';

export namespace Categories {
	export type Relations = 'user' | 'category';
	export interface Model {
		id?: string;
		user?: User;
		parent?: Category;
		sub_categories?: Category[];
		name: string;
		transactions?: Transaction[];
		created_at?: Date;
		updated_at?: Date;
	}

	export interface CreateRepository {
		run(category: Category): Promise<Category>;
	}

	export interface FindOneRepository {
		run(filter: Partial<Model>): Promise<Category>;
	}

	export interface FindRepository {
		run(
			filter: Partial<Model>,
			filters: BaseFilters<Model, Relations>
		): Promise<{ categories: Category[]; total: number }>;
	}
}
