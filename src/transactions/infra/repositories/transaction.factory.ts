import { Transactions } from "dist/transactions/domain/transaction";
import { setSeederFactory } from "typeorm-extension";
import { TransactionModel } from "./transactions.entity";

export default setSeederFactory(TransactionModel, (faker) => {
	const transaction = new TransactionModel()

	transaction.reference = faker.finance.transactionDescription()
	transaction.type = faker.helpers.arrayElement([
		Transactions.Type.EXPENSE,
		Transactions.Type.EXPENSE,
		Transactions.Type.EXPENSE,
		Transactions.Type.INCOME,
	])
	transaction.value = +faker.random.numeric(5, { allowLeadingZeros: true })

	return transaction
})
