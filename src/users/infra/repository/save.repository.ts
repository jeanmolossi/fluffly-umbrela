import { InternalServerErr, NotFoundErr } from "@/shared/domain/http-errors";
import { User, Users } from "@/users/domain";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserModel } from "./user.entity";

@Injectable()
export class SaveRepository implements Users.SaveRepository {
	constructor(
        @InjectRepository(UserModel)
        private readonly usersRepository: Repository<UserModel>,
    ) {}

	async run(userID: string, updateCb: (user: User) => User): Promise<User> {
		const user = await this.usersRepository.findOneBy({ id: userID })

		if (!user) throw new NotFoundErr('User not found')

		const updatedUser = updateCb(new User(user))

		const updatedUserModel = this.usersRepository.create(updatedUser)
		const { affected }= await this.usersRepository.update(userID, updatedUserModel)

		if (affected <= 0) {
			throw new InternalServerErr('Can not update user')
		}

		return updatedUser
	}

}
