import {
	Between,
	FindManyOptions,
	FindOperator,
	LessThanOrEqual,
	MoreThanOrEqual
} from 'typeorm';
import { BaseFilters } from './base.filters';

type DateCondition = {
	created_at?: FindOperator<Date>;
};

export abstract class BaseRepository {
	protected abstract run(...args: any): Promise<any>;

	protected options<
		M = {},
		T extends BaseFilters<{}, any> = any,
		Model = any
	>(where: Model, filters: T): FindManyOptions<M> {
		const {
			fields,
			start_date,
			end_date,
			per_page,
			page,
			sort,
			relations
		} = filters;

		return {
			select: this.getSelect(fields),
			where: {
				...((where as any) || {}),
				...this.getDateConditions(start_date, end_date)
			},
			take: per_page,
			skip: this.offset(page, per_page),
			order: sort,
			relations
		};
	}

	protected offset(page: number = 1, per_page: number = 15): number {
		return (page - 1) * per_page;
	}

	protected getSelect<T extends { id: string }>(fields: (keyof T)[]): any[] {
		if (fields?.length > 0) {
			// id should be ever selected
			return ['id', ...(fields as any)];
		}

		return undefined;
	}

	protected getDateConditions(start_date?: Date, end_date?: Date) {
		const date_filter: DateCondition = {};

		if (start_date && !end_date) {
			date_filter.created_at = MoreThanOrEqual(start_date);
		}

		if (!start_date && end_date) {
			date_filter.created_at = LessThanOrEqual(end_date);
		}

		if (start_date && end_date) {
			date_filter.created_at = Between(start_date, end_date);
		}

		return date_filter;
	}
}
