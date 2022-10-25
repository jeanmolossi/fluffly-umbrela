import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
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

	@ManyToOne(() => PaymentModel, p => p.transactions)
	wallet?: PaymentModel;

	@ManyToOne(() => CategoryModel, c => c.transactions)
	category?: CategoryModel;

	@ManyToOne(() => UserModel, u => u.transactions)
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
