import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Users } from '@/users/domain';
import { UserModel } from './user.entity';
import { UserMapper } from './user.mapper';

@Injectable()
export class CreateRepository implements Users.CreateRepository {
	constructor(
		@InjectRepository(UserModel)
		private readonly usersRepository: Repository<UserModel>
	) {}

	async run(user: User): Promise<User> {
		const created_user = this.usersRepository.create(user);
		const saved_user = await this.usersRepository.save(created_user);
		return UserMapper.modelToDomain(saved_user);
	}
}
