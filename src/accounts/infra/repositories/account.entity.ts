import { PaymentModel } from '@/payments/infra/repositories/payments.entity';
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

@Entity({ name: 'accounts' })
export class AccountModel {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => UserModel, u => u.accounts)
	user?: UserModel;

	@OneToMany(() => PaymentModel, w => w.account, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
	wallets?: PaymentModel[];

	@Column()
	name: string;

	@Column({ nullable: true, default: 0 })
	initial_amount?: number;

	@Column({ nullable: true, default: 0 })
	current_amount?: number;

	@Column({ nullable: true, default: 0 })
	bank_id?: number;

	@Column({ nullable: true, default: 'Carteira' })
	bank_name?: string;

	@CreateDateColumn()
	created_at?: Date;

	@UpdateDateColumn()
	updated_at?: Date;
}
