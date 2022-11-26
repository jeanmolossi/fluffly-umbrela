import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserModel } from '@/users/infra/repository/user.entity';

@Entity({ name: 'session' })
export class SessionModel {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@OneToOne(() => UserModel)
	@Column()
	user_id: string;

	@Column({ nullable: false })
	token: string;

	@Column({ nullable: false })
	created_at: number;
}
