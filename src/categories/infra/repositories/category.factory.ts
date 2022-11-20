import { setSeederFactory } from "typeorm-extension";
import { CategoryModel } from "./category.entity";

export default setSeederFactory(CategoryModel, (faker) => {
	const category = new CategoryModel()
	category.name = faker.commerce.productName()
	return category
})
