import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { MetaDTO } from '@/shared/infra/dto/meta.dto';
import { AccountDTO } from './account.dto';

@Exclude()
export class AccountListDTO {
	@Expose()
	@ApiProperty({ type: AccountDTO, isArray: true })
	accounts: AccountDTO[];

	@Expose()
	@ApiProperty({ type: MetaDTO })
	meta: MetaDTO;
}
