import { Entity } from '@/shared/domain/entity';
import {
	InternalServerErr,
	UnauthorizedErr
} from '@/shared/domain/http-errors';
import { compareSync, hashSync } from 'bcryptjs';
import { randomUUID } from 'crypto';
import { Users } from './namespace';

export class User extends Entity {
	constructor(private readonly _props: Users.Model) {
		// _props.id should be a new randomUUID if incoming
		// id is not defined
		_props.id = _props.id ?? randomUUID();

		super(_props.id);

		// initialize created_at and updated_at if incoming
		// props is not defined
		this._props.created_at = _props.created_at ?? new Date();
		this._props.updated_at = _props.updated_at ?? new Date();
	}

	get name(): string {
		return this._props.name;
	}

	get email(): string {
		return this._props.email;
	}

	/**
	 * updateEmail is a method to update the user's e-mail
	 * @param {string} newEmail represents the new email to be updated
	 * @return {void} void
	 */
	public updateEmail(newEmail: string): void {
		this._props.email = newEmail;
	}

	get avatar(): string {
		if (!this._props.avatar) {
			const total = 5;
			const range = Math.floor(Math.random() * total) + 1;
			return `https://randomuser.me/api/portraits/men/${range}.jpg`;
		}

		return this._props.avatar;
	}

	/**
	 * isValidPassword is a method who receives unencrypted
	 * password and check if it matches with encrypted password
	 * @param {string} password password to be check if is valid
	 * @return {boolean}
	 */
	public isValidPassword(password: string): boolean {
		return compareSync(password, this._props.password);
	}

	/**
	 * encryptPassword is a method who will encrypt password
	 * from user instance.
	 *
	 * It will get current unencrypted password, encrypt that
	 * and override unencrypted value by encrypted password
	 *
	 * @return {void} void
	 */
	public encrypyPassword(): void {
		this._props.password = hashSync(this._props.password);
	}

	get password(): string {
		return this._props.password;
	}

	/**
	 * updatePassword is a method to check if change password is possible
	 * @param {Users.PasswordConfirmation} passwordConfirmation is an object who contains the params used to check update password
	 */
	public updatePassword(passwordConfirmation: Users.PasswordConfirmation) {
		const { currentPassword, newPassword, reTypedNewPassword } =
			passwordConfirmation;

		if (newPassword !== reTypedNewPassword) {
			throw new InternalServerErr('passwords does not match');
		}

		if (!this.isValidPassword(currentPassword)) {
			throw new UnauthorizedErr('invalid credentials');
		}

		// when all validations pass we re-assign password to new one
		this._props.password = newPassword;
		// after new password re-assign encrypt that
		this.encrypyPassword();
	}

	public resetPasswrod(passwordReset: Users.ResetPassword) {
		const { newPassword, reTypedNewPassword } = passwordReset;

		if (newPassword !== reTypedNewPassword) {
			throw new InternalServerErr('passwords does not match');
		}

		// when all validations pass we re-assign password to new one
		this._props.password = newPassword;
		// after new password re-assign encrypt that
		this.encrypyPassword();
	}
}
