import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './categories.controller';
import { CategoryModel } from './infra/repositories/category.entity';
import { CreateCategoryRepository } from './infra/repositories/create.repository';
import { FindOneCategoryRepository } from './infra/repositories/find-one.repository';
import { CreateCategoryService } from './infra/services/create.service';

@Module({
	imports: [TypeOrmModule.forFeature([CategoryModel])],
	controllers: [CategoriesController],
	providers: [
		// repositories
		CreateCategoryRepository,
		FindOneCategoryRepository,
		// services
		CreateCategoryService
	]
})
export class CategoriesModule {}
