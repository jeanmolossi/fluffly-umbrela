import { AuthService } from '@/auth/auth.service';
import { User } from '@/users/domain';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super({ usernameField: 'email' });
	}

	async validate(email: string, password: string): Promise<User> {
		return await this.authService.validateUser({
			email,
			password
		});
	}
}
