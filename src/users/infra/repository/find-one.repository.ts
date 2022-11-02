import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Users } from '@/users/domain';
import { UserModel } from './user.entity';
import { UserMapper } from './user.mapper';

@Injectable()
export class FindOneRepository implements Users.FindOneRepository {
	constructor(
		@InjectRepository(UserModel)
		private readonly usersRepository: Repository<UserModel>
	) {}

	async run(filter: Partial<Users.Model>): Promise<User> {
		const user = await this.usersRepository.findOneBy(filter);
		return UserMapper.modelToDomain(user);
	}
}
