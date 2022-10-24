import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TransactionAddedEvent } from '@/transactions/infra/events/transaction-added.event';

@Injectable()
export class TransactionAddedListener {
	@OnEvent('transaction.added')
	handleTransactionAddedEvent(event: TransactionAddedEvent) {
		console.log({ event });
	}
}
