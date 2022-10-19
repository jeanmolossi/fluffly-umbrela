import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundErr } from '@/shared/domain/http-errors';
import { User, Users } from '@/users/domain';
import { UserModel } from './user.entity';

@Injectable()
export class FindOneRepository implements Users.FindOneRepository {
	constructor(
		@InjectRepository(UserModel)
		private readonly usersRepository: Repository<UserModel>
	) {}

	async run(filter: Partial<Users.Model>): Promise<User> {
		const user = await this.usersRepository.findOne({
			where: filter
		});

		if (!user) {
			throw new NotFoundErr('User not found');
		}

		return new User(user);
	}
}
