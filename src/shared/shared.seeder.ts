import { AccountModel } from '@/accounts/infra/repositories/account.entity';
import { CategoryModel } from '@/categories/infra/repositories/category.entity';
import { PaymentModel } from '@/payments/infra/repositories/payments.entity';
import { TransactionModel } from '@/transactions/infra/repositories/transactions.entity';
import { UserModel } from '@/users/infra/repository/user.entity';
import { faker } from '@faker-js/faker';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class MainSeeder implements Seeder {
	public async run(
		dataSource: DataSource,
		factoryManager: SeederFactoryManager
	): Promise<unknown> {
		const user_factory = factoryManager.get(UserModel);
		const account_factory = factoryManager.get(AccountModel)
		const wallet_factory = factoryManager.get(PaymentModel)
		const category_factory = factoryManager.get(CategoryModel)
		const transaction_factory = factoryManager.get(TransactionModel)

		const deltas = {
			users: 5,
			categories: 10,
			accounts: 3,
			wallets: 5,
			transactions: 50
		}

		const users = await user_factory.saveMany(deltas.users);

		const categories = await Promise.all(
			Array.from<CategoryModel>({ length: deltas.categories * deltas.users }).map(async (_, i, _categories) => {
				return await category_factory.make({
					user: { id: faker.helpers.arrayElement(users).id } as any,
				})
			})
		)

		await dataSource.getRepository(CategoryModel)
			.save(categories)

		const accounts = await Promise.all(
			Array.from({ length: deltas.accounts * deltas.users }).map(async () => {
				return await account_factory.make({
					user:  { id: faker.helpers.arrayElement(users).id } as any
				})
			})
		)

		await dataSource.getRepository(AccountModel)
			.save(accounts)

		const wallets = await Promise.all(
			Array.from({ length: deltas.wallets }).map(async () => {
				const account = faker.helpers.arrayElement(accounts)
				return await wallet_factory.make({
					account: { id: account.id } as any,
					user: { id: account.user.id } as any
				})
			})
		)

		await dataSource.getRepository(PaymentModel)
			.save(wallets)

		const transactions = await Promise.all(
			Array.from({ length: users.length * deltas.transactions })
				.map(async (_, i, _transactions) => {
					const wallet = faker.helpers.arrayElement(wallets)
					const categories_from_user = categories.filter(c => c.user.id === wallet.user.id)
					const category = { id: faker.helpers.arrayElement(categories_from_user).id } as any

					return await transaction_factory.make({
						user: { id: wallet.user.id } as any,
						wallet: { id: wallet.id } as any,
						category,
					})
				})
		)

		await dataSource.getRepository(TransactionModel)
			.save(transactions)

		console.table([
			{
				users: users.length,
				categories: categories.length,
				accounts: accounts.length,
				wallets: wallets.length,
				transactions: transactions.length
			}
		])

		return
	}
}
