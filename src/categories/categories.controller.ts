import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { JwtAuthGuard } from '@/auth/infra/guards/jwt-auth.guard';
import { Pagination } from '@/shared/infra/adapters/pagination';
import { AuthUser } from '@/shared/infra/decorators/user.decorator';
import { User } from '@/users/domain';
import { AddCategory } from './infra/adapters/add-category';
import { CategoryListDTO } from './infra/dto/category-list.dto';
import { CategoryDTO } from './infra/dto/category.dto';
import { CreateCategoryService } from './infra/services/create.service';
import { FindMyCategoriesService } from './infra/services/find.service';

@Controller('categories')
@ApiTags('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
	constructor(
		private readonly createService: CreateCategoryService,
		private readonly findService: FindMyCategoriesService
	) {}

	@Post()
	@ApiCreatedResponse({ type: CategoryDTO })
	async addCategory(
		@Body() add_category: AddCategory,
		@AuthUser() user: User
	) {
		add_category.user_id = user.id;

		const category = await this.createService.run(add_category);

		return plainToClass(CategoryDTO, category);
	}

	@Get()
	@ApiOkResponse({ type: CategoryListDTO })
	async getMyCategories(
		@AuthUser() user: User,
		@Query() { page, per_page }: Pagination
	) {
		return await this.findService.run(user, page, per_page);
	}
}
