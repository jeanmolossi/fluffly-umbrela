import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserModel {
	@PrimaryGeneratedColumn('uuid')
	id?: string;

	@Column()
	name: string;

	@Column()
	email: string;

	@Column()
	password: string;

	@Column({ nullable: true })
	avatar?: string;

	@CreateDateColumn()
	created_at?: Date;

	@UpdateDateColumn()
	updated_at?: Date;
}
