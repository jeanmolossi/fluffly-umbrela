import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';
import { Payment } from '@/payments/domain';

@Entity({ name: 'payments' })
export class PaymentModel {
	@PrimaryGeneratedColumn('uuid')
	id: string;

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
