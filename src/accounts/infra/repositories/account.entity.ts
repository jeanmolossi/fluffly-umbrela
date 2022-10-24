import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';
import { UserModel } from '@/users/infra/repository/user.entity';

@Entity({ name: 'accounts' })
export class AccountModel {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'uuid' })
	user_id: string;

	@ManyToOne(() => UserModel, u => u.accounts)
	user: UserModel;

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
