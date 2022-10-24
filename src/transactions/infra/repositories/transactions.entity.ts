import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';
import { CategoryModel } from '@/categories/infra/repositories/category.entity';
import { PaymentModel } from '@/payments/infra/repositories/payments.entity';
import { Transactions } from '@/transactions/domain';
import { UserModel } from '@/users/infra/repository/user.entity';

@Entity({ name: 'transactions' })
export class TransactionModel {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'uuid' })
	wallet_id: string;

	@OneToMany(() => PaymentModel, p => p.transactions)
	wallet?: PaymentModel;

	@Column({ type: 'uuid' })
	category_id: string;

	@OneToMany(() => CategoryModel, c => c.id)
	category?: CategoryModel;

	@Column({ type: 'uuid' })
	user_id: string;

	@OneToMany(() => UserModel, u => u.id)
	user?: UserModel;

	@Column()
	reference: string;

	@Column({ type: 'integer' })
	value: number;

	@Column({ nullable: true, default: Transactions.Type.EXPENSE })
	type: Transactions.Type;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
