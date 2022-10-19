import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@/users/domain';

// eslint-disable-next-line
export const AuthUser = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();

		return request.user as User;
	}
);
