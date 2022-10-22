import {
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	Entity,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn
} from 'typeorm';
import { UserModel } from '@/users/infra/repository/user.entity';

@Entity({ name: 'categories' })
export class CategoryModel {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column({ nullable: true, type: 'uuid' })
	parent_id?: string;

	@ManyToOne(() => CategoryModel, category => category.sub_categories)
	parent?: CategoryModel;

	@OneToMany(() => CategoryModel, c => c)
	sub_categories?: CategoryModel[];

	@Column({ type: 'uuid' })
	user_id?: string;

	@OneToMany(() => UserModel, u => u.categories)
	user: UserModel;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
