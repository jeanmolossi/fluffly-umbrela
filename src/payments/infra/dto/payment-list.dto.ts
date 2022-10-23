import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { MetaDTO } from '@/shared/infra/dto/meta.dto';
import { PaymentDTO } from './payment.dto';

@Exclude()
export class PaymentListDTO {
	@Expose()
	@ApiProperty({ type: PaymentDTO, isArray: true })
	payments: PaymentDTO[];

	@Expose()
	@ApiProperty({ type: MetaDTO })
	meta: MetaDTO;
}
