import { UserModel } from '@/users/infra/repository/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'session' })
export class SessionModel {
	@PrimaryGeneratedColumn('uuid')
	session_id: string;

	@OneToOne(() => UserModel)
	@Column()
	user_id: string;

	@Column({ nullable: false })
	session_token: string;

	@Column({ nullable: false })
	refresh_token: string;
}
