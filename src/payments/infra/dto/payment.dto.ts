import { Exclude, Expose } from 'class-transformer';
import { Payment } from '@/payments/domain';

@Exclude()
export class PaymentDTO {
	@Expose() id: string;
	@Expose() name: string;
	@Expose() type: Payment.Type;
	@Expose() limit: number;
	@Expose() brand: Payment.Brand;

	get readable_limit() {
		return '';
	}
}
