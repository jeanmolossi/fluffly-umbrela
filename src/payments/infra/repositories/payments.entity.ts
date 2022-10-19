import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';
import { Payment } from '@/payments/domain';
import { UserModel } from '@/users/infra/repository/user.entity';

@Entity({ name: 'payments' })
export class PaymentModel {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ name: 'user_id' })
	user_id: string;

	@ManyToOne(() => UserModel)
	user: UserModel;

	@Column()
	name: string;

	@Column({ nullable: true, default: 'CASH' })
	type: Payment.Type;

	@Column({ nullable: true })
	limit: number;

	@Column({ nullable: true })
	brand: Payment.Brand;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
