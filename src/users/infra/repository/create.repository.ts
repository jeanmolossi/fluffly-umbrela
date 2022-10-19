import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictErr } from '@/shared/domain/http-errors';
import { User, Users } from '@/users/domain';
import { UserModel } from './user.entity';

@Injectable()
export class CreateRepository implements Users.CreateRepository {
	constructor(
		@InjectRepository(UserModel)
		private readonly usersRepository: Repository<UserModel>
	) {}

	async run(user: Users.Model): Promise<User> {
		const new_user = new User(user);

		if (await this.userAlreadyExists(new_user.email)) {
			throw new ConflictErr('User already exists');
		}

		new_user.encrypyPassword();
		const created_user = this.usersRepository.create(new_user);
		const { id, name, email, password, created_at, updated_at } =
			await this.usersRepository.save(created_user);

		return new User({ id, name, email, password, created_at, updated_at });
	}

	private async userAlreadyExists(email: string) {
		return this.usersRepository.findOneBy({ email });
	}
}
