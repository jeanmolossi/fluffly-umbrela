import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { JwtAuthGuard } from '@/auth/infra/guards/jwt-auth.guard';
import { AuthUser } from '@/shared/infra/decorators/user.decorator';
import { User } from '@/users/domain';
import { AddCategory } from './infra/adapters/add-category';
import { CategoryDTO } from './infra/dto/category.dto';
import { CreateCategoryService } from './infra/services/create.service';

@Controller('categories')
@ApiTags('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
	constructor(private readonly createService: CreateCategoryService) {}

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
}
