import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InternalServerErr, NotFoundErr } from '@/shared/domain/http-errors';
import { User, Users } from '@/users/domain';
import { UserModel } from './user.entity';
import { UserMapper } from './user.mapper';

@Injectable()
export class SaveRepository implements Users.SaveRepository {
	constructor(
		@InjectRepository(UserModel)
		private readonly usersRepository: Repository<UserModel>
	) {}

	async run(userID: string, updateCb: (user: User) => User): Promise<User> {
		const user = await this.usersRepository.findOneBy({ id: userID });

		if (!user) throw new NotFoundErr('User not found');

		const updated_user = updateCb(UserMapper.modelToDomain(user));

		const updated_user_model = this.usersRepository.create(updated_user);
		const { affected } = await this.usersRepository.update(
			userID,
			updated_user_model
		);

		if (affected <= 0) {
			throw new InternalServerErr('Can not update user');
		}

		return updated_user;
	}
}
