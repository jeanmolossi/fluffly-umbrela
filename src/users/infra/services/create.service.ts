import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Users } from '@/users/domain';
import { RegisterUser } from '../adapters/register-user';
import { UserDTO } from '../dto/user.dto';
import { CreateRepository } from '../repository/create.repository';

@Injectable()
export class CreateService {
	constructor(
		@Inject(CreateRepository)
		private readonly createRepository: Users.CreateRepository
	) {}

	async run(register: RegisterUser): Promise<UserDTO> {
		const user = await this.createRepository.run(register);
		return plainToClass(UserDTO, user);
	}
}
