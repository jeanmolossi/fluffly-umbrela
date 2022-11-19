import { faker } from '@faker-js/faker';
import { Account } from '@/accounts/domain';
import { AccountModel } from '@/accounts/infra/repositories/account.entity';
import { AccountMapper } from '@/accounts/infra/repositories/account.mapper';
import { UserModel } from '@/users/infra/repository/user.entity';
import { println } from './cli';
import data_source from './data_source';

async function mockAccount(account: Partial<Account>): Promise<AccountModel> {
	const fake_initial_amount = +faker.random.numeric(7);

	const db = await data_source;

	const [user] = await db
		.createQueryBuilder()
		.select('u.id', 'id')
		.from(UserModel, 'u')
		.orderBy('random()')
		.take(1)
		.execute();

	const fake_account = new Account({
		name: faker.finance.accountName(),
		bank_id: +faker.finance.account(3),
		bank_name: faker.company.name(),
		initial_amount: fake_initial_amount,
		current_amount: +faker.random.numeric(7) + fake_initial_amount,
		user: user.id,
		...account
	});

	return AccountMapper.domainToModel(fake_account);
}

export default async function bootstrap({ amount }) {
	println.info('seed de contas iniciado');
	const accounts = await Promise.all(
		Array.from({ length: amount }).map(mockAccount)
	);

	const db = await data_source;

	return await db
		.createQueryBuilder()
		.insert()
		.into(AccountModel)
		.values(accounts)
		.execute()
		.then(r => {
			println.info('seed de contas finalizado');
			return r;
		});
}
