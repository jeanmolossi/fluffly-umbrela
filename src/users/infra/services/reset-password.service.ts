import { UnauthorizedErr } from '@/shared/domain/http-errors';
import { User, Users } from '@/users/domain';
import { OTP } from '@/users/domain/otp';
import { Inject, Injectable } from '@nestjs/common';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { ResetPassword } from '../adapters/reset-password';
import { FindOneRepository } from '../repository/find-one.repository';
import { SaveRepository } from '../repository/save.repository';

@Injectable()
export class ResetPasswordService {
	constructor(
		@Inject(SaveRepository)
		private readonly save: Users.SaveRepository,
		@Inject(FindOneRepository)
		private readonly findOne: Users.FindOneRepository,
	) {}

	async run({
		OTP: otp,
		email,
		hash,
		timestamp,
		new_password, confirm_password
	}: ResetPassword): Promise<UserDTO> {
		const otpReceived = new OTP({
			email, otp: +otp, timestamp,
		})

		if (!otpReceived.isValid(hash)) {
			throw new UnauthorizedErr("Invalid otp")
		}

		const user = await this.findOne.run({ email })
		const userUpdated = await this.save.run(
			user.id,
			this.update(new_password, confirm_password),
		)

		return plainToClass(UserDTO, userUpdated)
	}

	private update(password: string, confirm_password: string): Users.Updater {
		return function (user: User): User {
			user.resetPasswrod({
				newPassword: password,
				reTypedNewPassword: confirm_password,
			})

			return user
		}
	}
}

@Exclude()
export class UserDTO {
	@Expose() id: string;
	@Expose() name: string;
	@Expose() email: string
}
