import { Faker } from '@faker-js/faker';
import { hashSync } from 'bcryptjs';
import { setSeederFactory } from "typeorm-extension";
import { UserModel } from "./user.entity";

let avatar_url = ''
const avatar_cache = (faker: Faker) => {
	if (!avatar_url)
		avatar_url = faker.internet.avatar()

	return avatar_url
}

export default setSeederFactory(UserModel, (faker) => {
	const user = new UserModel()
	user.name = faker.name.firstName()
	user.email = faker.internet.email().toLowerCase()
	user.password = hashSync('123456')
	user.avatar = avatar_cache(faker)

	return user
})
