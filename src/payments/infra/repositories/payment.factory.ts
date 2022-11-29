import { setSeederFactory } from 'typeorm-extension';
import { Payment } from '@/payments/domain';
import { PaymentModel } from './payments.entity';

export default setSeederFactory(PaymentModel, faker => {
	const wallet = new PaymentModel();

	const card_last_digits = faker.finance.creditCardNumber().slice(-4);
	wallet.name = `${faker.commerce.productMaterial()} ${card_last_digits}`;

	const _type = faker.helpers.arrayElement([
		Payment.Type.CASH,
		Payment.Type.CREDIT,
		Payment.Type.DEBIT
	]);
	wallet.type = _type;
	wallet.brand = faker.helpers.maybe(
		() =>
			faker.helpers.arrayElement([
				Payment.Brand.AMERICAN_EXPRESS,
				Payment.Brand.ELO,
				Payment.Brand.MASTER,
				Payment.Brand.VISA
			]),
		{ probability: _type === Payment.Type.CASH ? 0 : 1 }
	);
	wallet.limit = faker.helpers.maybe(() => +faker.random.numeric(7), {
		probability: _type === Payment.Type.CREDIT ? 1 : 0
	});

	return wallet;
});
