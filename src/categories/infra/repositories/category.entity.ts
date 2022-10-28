import {
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	Entity,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn
} from 'typeorm';
import { TransactionModel } from '@/transactions/infra/repositories/transactions.entity';
import { UserModel } from '@/users/infra/repository/user.entity';

@Entity({ name: 'categories' })
export class CategoryModel {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@ManyToOne(() => CategoryModel, category => category.sub_categories)
	parent?: CategoryModel;

	@OneToMany(() => CategoryModel, c => c.parent)
	sub_categories?: CategoryModel[];

	@ManyToOne(() => UserModel, u => u.categories)
	user?: UserModel;

	@OneToMany(() => TransactionModel, t => t.category)
	transactions?: TransactionModel[];

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
