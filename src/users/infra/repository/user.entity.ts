import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';
import { CategoryModel } from '@/categories/infra/repositories/category.entity';

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

	@CreateDateColumn()
	created_at?: Date;

	@UpdateDateColumn()
	updated_at?: Date;
}
