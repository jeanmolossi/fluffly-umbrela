import { Exclude, Expose, Transform } from 'class-transformer';
import { Payment } from '@/payments/domain';

@Exclude()
export class PaymentDTO {
	@Expose() id: string;
	@Expose() user_id: string;
	@Expose() name: string;
	@Expose() type: Payment.Type;
	@Transform(({ obj }) => obj.readable_limit)
	@Expose()
	limit: number;
	@Expose() brand: Payment.Brand;
}
