import { AccountModel } from '@/accounts/infra/repositories/account.entity';
import { Payment } from '@/payments/domain';
import { TransactionModel } from '@/transactions/infra/repositories/transactions.entity';
import { UserModel } from '@/users/infra/repository/user.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';

@Entity({ name: 'payments' })
export class PaymentModel {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => UserModel)
	user: UserModel;

	@OneToMany(() => TransactionModel, t => t.wallet, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
	transactions?: TransactionModel[];

	@ManyToOne(() => AccountModel, a => a.wallets)
	account?: AccountModel;

	@Column()
	name: string;

	@Column({ nullable: true, default: 'CASH' })
	type: Payment.Type;

	@Column({ nullable: true })
	limit: number;

	@Column({ nullable: true })
	brand: Payment.Brand;

	@CreateDateColumn()
	created_at?: Date;

	@UpdateDateColumn()
	updated_at?: Date;
}
