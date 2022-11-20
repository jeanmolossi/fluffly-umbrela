import { TransactionModel } from '@/transactions/infra/repositories/transactions.entity';
import { UserModel } from '@/users/infra/repository/user.entity';
import {
	Column, CreateDateColumn, Entity,
	ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

@Entity({ name: 'categories' })
export class CategoryModel {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@ManyToOne(() => CategoryModel, category => category.sub_categories, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
	parent?: CategoryModel;

	@OneToMany(() => CategoryModel, c => c.parent, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
	sub_categories?: CategoryModel[];

	@ManyToOne(() => UserModel, u => u.categories)
	user?: UserModel;

	@OneToMany(() => TransactionModel, t => t.category, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
	transactions?: TransactionModel[];

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
