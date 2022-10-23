import { Category } from './category';

export namespace Categories {
	export interface Model {
		id?: string;
		parent_id?: string;
		user_id?: string;
		name: string;
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
			page?: number,
			per_page?: number
		): Promise<{ categories: Category[]; total: number }>;
	}
}
