import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';
import { CategoryModel } from '@/categories/infra/repositories/category.entity';
import { TransactionModel } from '@/transactions/infra/repositories/transactions.entity';

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

	@OneToMany(() => CategoryModel, c => c.user)
	categories?: CategoryModel;

	@ManyToOne(() => TransactionModel, t => t.user)
	transactions?: TransactionModel[];

	@CreateDateColumn()
	created_at?: Date;

	@UpdateDateColumn()
	updated_at?: Date;
}
