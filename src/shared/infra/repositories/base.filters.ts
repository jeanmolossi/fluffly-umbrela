import { FindOptionsOrder } from 'typeorm';

export type KeysOf<Entity> = keyof Entity;

export interface BaseFilters<Fields extends object, T = string> {
	page?: number;
	per_page?: number;
	start_date?: Date;
	end_date?: Date;
	relations?: T[];
	sort?: FindOptionsOrder<Fields>;
	fields?: KeysOf<Fields>[];
}
