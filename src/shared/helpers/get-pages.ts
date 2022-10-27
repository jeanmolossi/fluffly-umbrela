import { BaseFilters } from '../infra/repositories/base.filters';
import constants from '../shared.constants';

interface Pagination {
	total: number;
	page: number;
	per_page: number;
}

interface PaginationMeta extends Pagination {
	first_page: string | null;
	prev_page: string | null;
	next_page: string | null;
	last_page: string | null;
}

export function get_pages<T extends object, M = any>(
	resource: string,
	total: number,
	filters: BaseFilters<T, M>
): PaginationMeta {
	const { page = 1, per_page = 15 } = filters;

	const link_base = { resource, total, per_page };
	Object.assign(link_base, {
		additional_query: build_additional_query(filters)
	});

	const last_page_num = Math.ceil(total / per_page);

	let last_page: string;
	let next_page: string;
	if (page < last_page_num) {
		last_page = build_link({ ...link_base, page: last_page_num });
		next_page = build_link({ ...link_base, page: page + 1 });
	}

	let first_page: string;
	let prev_page: string;
	if (page > 1) {
		first_page = build_link({ ...link_base, page: 1 });
		prev_page = build_link({ ...link_base, page: page - 1 });
	}

	return {
		total,
		page,
		per_page,

		first_page,
		prev_page,
		next_page,
		last_page
	};
}

interface BuildLink extends Omit<Pagination, 'total'> {
	resource: string;
	additional_query?: string;
}

function build_link({
	resource,
	page,
	per_page,
	additional_query = ''
}: BuildLink): string {
	const query = new URLSearchParams();
	query.set('page', page.toString());
	query.set('per_page', per_page.toString());
	additional_query = additional_query ? `&${additional_query}` : '';

	return `${
		constants.BASE_HOST
	}/${resource}?${query.toString()}${additional_query}`;
}

function build_additional_query<T extends object, M>(
	filters: BaseFilters<T, M>
): string {
	const keys_to_ignore = ['total', 'page', 'per_page'];
	const flat_map = ([key, value]) => {
		if (keys_to_ignore.includes(key)) return [];
		return [`${key}=${encodeURIComponent(value)}`];
	};
	return Object.entries(filters).flatMap(flat_map).join('&');
}
