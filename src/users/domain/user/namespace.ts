import { Account } from '@/accounts/domain';
import { Category } from '@/categories/domain';
import { Transaction } from '@/transactions/domain';
import { User } from './user';

export namespace Users {
	export interface Model {
		id?: string;
		name: string;
		email: string;
		password: string;
		avatar?: string;
		categories?: Category[];
		accounts?: Account[];
		transactions?: Transaction[];
		created_at?: Date;
		updated_at?: Date;
	}

	/**
	 * PasswordConfirmation is the object used to update user password
	 * @param {string} current_password 	- is actual unencrypted password
	 * @param {string} new_password			- is the new one password
	 * @param {string} retyped_new_password	- is the new one password confirmation
	 */
	export interface PasswordConfirmation {
		current_password: string;
		new_password: string;
		retyped_new_password: string;
	}

	export type ResetPassword = Omit<PasswordConfirmation, 'current_password'>;

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
