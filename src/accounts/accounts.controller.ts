import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
	ApiBody,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiTags
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/infra/guards/jwt-auth.guard';
import { AuthUser } from '@/shared/infra/decorators/user.decorator';
import { User } from '@/users/domain';
import { AccountFilters } from './infra/adapters/account-filters';
import { AddAccount } from './infra/adapters/add-account';
import { AccountListDTO } from './infra/dto/account-list.dto';
import { AccountDTO } from './infra/dto/account.dto';
import { AddAccountService } from './infra/services/add-account.service';
import { GetMyAccountsService } from './infra/services/my-accounts.service';

@Controller('accounts')
@ApiTags('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
	constructor(
		private readonly addAccountService: AddAccountService,
		private readonly getMyAccountsService: GetMyAccountsService
	) {}

	@Post()
	@ApiBody({ type: AddAccount })
	@ApiCreatedResponse({ type: AccountDTO })
	async addAccount(@AuthUser() user: User, @Body() add_account: AddAccount) {
		add_account.user_id = user.id;
		return await this.addAccountService.run(add_account);
	}

	@Get()
	@ApiOkResponse({ type: AccountListDTO })
	async myAccounts(
		@AuthUser() user: User,
		@Query() pagination: AccountFilters
	) {
		return await this.getMyAccountsService.run(user, pagination);
	}
}
