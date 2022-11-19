import { cli, println } from './cli';
import seed_accounts from './seed_accounts';
import seed_users from './seed_users';

type CliSeedParams = {
	users: number;
	accounts: number;
};

async function bootstrap() {
	const { users, accounts } = cli<CliSeedParams>({
		schema: {
			users: Number,
			accounts: Number
		},
		required: ['users']
	});

	await seed_users({ amount: users });
	await seed_accounts({ amount: accounts });

	println.info('seed executado');
	process.exit(0);
}

bootstrap();
