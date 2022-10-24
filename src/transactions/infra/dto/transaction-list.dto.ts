import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { MetaDTO } from '@/shared/infra/dto/meta.dto';
import { TransactionDTO } from './transaction.dto';

export class TransactionListDTO {
	@Expose()
	@ApiProperty({ type: TransactionDTO, isArray: true })
	transactions: TransactionDTO[];

	@Expose()
	@ApiProperty({ type: MetaDTO })
	meta: MetaDTO;
}
