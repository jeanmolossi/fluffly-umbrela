import { User } from './user';

export namespace Users {
	export interface Model {
		id?: string;
		name: string;
		email: string;
		password: string;
		avatar?: string;
		created_at?: Date;
		updated_at?: Date;
	}

	/**
	 * PasswordConfirmation is the object used to update user password
	 * @param {string} currentPassword 	- is actual unencrypted password
	 * @param {string} newPassword		- is the new one password
	 * @param {string} reTypedNewPassword- is the new one password confirmation
	 */
	export interface PasswordConfirmation {
		currentPassword: string;
		newPassword: string;
		reTypedNewPassword: string;
	}

	export type ResetPassword = Omit<PasswordConfirmation, 'currentPassword'>;

	export interface CreateRepository {
		run(user: Model): Promise<User>;
	}

	export interface FindOneRepository {
		run(filter: Partial<Model>): Promise<User>;
	}

	export interface FindRepository {
		run(filter: Partial<Model>): Promise<User[]>;
	}

	export type Updater = (user: User) => User;
	export interface SaveRepository {
		run(userID: string, updateCb: Updater): Promise<User>;
	}
}
