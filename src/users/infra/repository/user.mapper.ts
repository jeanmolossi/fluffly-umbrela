import { AccountMapper } from '@/accounts/infra/repositories/account.mapper';
import { CategoryMapper } from '@/categories/infra/repositories/category.mapper';
import { TransactionMapper } from '@/transactions/infra/repositories/transactions.mapper';
import { User } from '@/users/domain';
import { UserModel } from './user.entity';

export class UserMapper {
	static modelToDomain(user: UserModel) {
		if (!user?.id) return;

		const {
			id,
			name,
			email,
			password,
			avatar,
			accounts,
			categories,
			transactions,
			created_at,
			updated_at
		} = user;

		return new User({
			id,
			name,
			email,
			password,
			avatar,
			accounts: AccountMapper.arrayModelToDomain(accounts),
			categories: CategoryMapper.arrayModelToDomain(categories),
			transactions: TransactionMapper.arrayModelToDomain(transactions),
			created_at,
			updated_at
		});
	}

	static arrayModelToDomain(users: UserModel[]): User[] {
		return users?.map(this.modelToDomain);
	}

	static domainToModel(user: User): UserModel {
		const to_props: UserModel = {
			id: user.id,
			name: user.name,
			email: user.email,
			password: user.password,
			avatar: user.avatar
		};

		return Object.assign(new UserModel(), to_props);
	}
}
