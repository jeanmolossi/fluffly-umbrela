import { ConflictErr } from "@/shared/domain/http-errors";
import { User, Users } from "@/users/domain";
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserModel } from "./user.entity";

@Injectable()
export class CreateRepository implements Users.CreateRepository {
	constructor(
        @InjectRepository(UserModel)
        private readonly usersRepository: Repository<UserModel>,
    ) {}

	async run(user: Users.Model): Promise<User> {
		const newUser = new User(user)

        if (await this.userAlreadyExists(newUser.email)) {
            throw new ConflictErr("User already exists")
        }

		newUser.encrypyPassword()
		const createdUser = this.usersRepository.create(newUser)
		const { id, name, email, password, created_at, updated_at } = await this.usersRepository.save(createdUser)

		return new User({ id, name, email, password, created_at, updated_at })
	}

    private async userAlreadyExists(email: string) {
        return this.usersRepository.findOneBy({ email })
    }
}
