import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './categories.controller';
import { CategoryModel } from './infra/repositories/category.entity';
import { CreateCategoryRepository } from './infra/repositories/create.repository';
import { FindOneCategoryRepository } from './infra/repositories/find-one.repository';
import { FindCategoryRepository } from './infra/repositories/find.repository';
import { CreateCategoryService } from './infra/services/create.service';
import { FindMyCategoriesService } from './infra/services/find.service';

@Module({
	imports: [TypeOrmModule.forFeature([CategoryModel])],
	controllers: [CategoriesController],
	providers: [
		// repositories
		CreateCategoryRepository,
		FindOneCategoryRepository,
		FindCategoryRepository,
		// services
		CreateCategoryService,
		FindMyCategoriesService
	]
})
export class CategoriesModule {}
