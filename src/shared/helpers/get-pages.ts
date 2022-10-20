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

export function get_pages(
	resource: string,
	total: number,
	page: number = 1,
	per_page: number = 15
): PaginationMeta {
	const link_base = { resource, total, per_page };
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

interface BuildLink extends Pagination {
	resource: string;
	aditional_query?: string;
}

function build_link({
	resource,
	page,
	per_page,
	aditional_query = ''
}: BuildLink): string {
	const query = new URLSearchParams();
	query.set('page', page.toString());
	query.set('per_page', per_page.toString());
	aditional_query = aditional_query ? `&${aditional_query}` : '';

	return `${
		constants.BASE_HOST
	}/${resource}?${query.toString()}${aditional_query}`;
}
