import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ConflictErr } from '@/shared/domain/http-errors';
import { User, Users } from '@/users/domain';
import { RegisterUser } from '../adapters/register-user';
import { UserDTO } from '../dto/user.dto';
import { CreateRepository } from '../repository/create.repository';
import { FindOneRepository } from '../repository/find-one.repository';

@Injectable()
export class CreateService {
	constructor(
		@Inject(CreateRepository)
		private readonly createRepository: Users.CreateRepository,
		@Inject(FindOneRepository)
		private readonly findOne: Users.FindOneRepository
	) {}

	async run(register: RegisterUser): Promise<UserDTO> {
		if (await this.userAlreadyExists(register.email)) {
			throw new ConflictErr('User already exists');
		}

		const new_user = new User(register);
		new_user.encryptPassword();
		const user = await this.createRepository.run(new_user);
		return plainToClass(UserDTO, user);
	}

	async userAlreadyExists(email: string) {
		return this.findOne.run({ email });
	}
}
