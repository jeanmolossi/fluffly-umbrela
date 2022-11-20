import { AccountModel } from '@/accounts/infra/repositories/account.entity';
import { CategoryModel } from '@/categories/infra/repositories/category.entity';
import { TransactionModel } from '@/transactions/infra/repositories/transactions.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';

@Entity({ name: 'users' })
export class UserModel {
	@PrimaryGeneratedColumn('uuid')
	id?: string;

	@Column()
	name: string;

	@Column()
	email: string;

	@Column()
	password: string;

	@Column({ nullable: true })
	avatar?: string;

	@OneToMany(() => CategoryModel, c => c.user, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
	categories?: CategoryModel[];

	@OneToMany(() => TransactionModel, t => t.user, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
	transactions?: TransactionModel[];

	@OneToMany(() => AccountModel, a => a.user, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
	accounts?: AccountModel[];

	@CreateDateColumn()
	created_at?: Date;

	@UpdateDateColumn()
	updated_at?: Date;
}
