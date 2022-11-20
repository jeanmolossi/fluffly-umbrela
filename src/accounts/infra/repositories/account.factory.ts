import { setSeederFactory } from "typeorm-extension";
import { AccountModel } from "./account.entity";

export default setSeederFactory(AccountModel, (faker) => {
	const account = new AccountModel()

	account.name = faker.finance.accountName()
	account.bank_id = +faker.finance.account(3)
	account.bank_name = faker.company.name()
	account.current_amount = +faker.random.numeric(7)

	return account
})
