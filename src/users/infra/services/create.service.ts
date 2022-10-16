import { Users } from '@/users/domain';
import { Inject, Injectable } from '@nestjs/common';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { RegisterUser } from '../adapters/register-user';
import { CreateRepository } from '../repository/create.repository';

@Injectable()
export class CreateService {
	constructor(
		@Inject(CreateRepository)
		private readonly createRepository: Users.CreateRepository,
	) {}

	async run(register: RegisterUser): Promise<UserDTO> {
		const user = await this.createRepository.run(register)
		return plainToClass(UserDTO, user)
	}
}

@Exclude()
export class UserDTO {
	@Expose() id: string;
	@Expose() name: string;
	@Expose() email: string
}
