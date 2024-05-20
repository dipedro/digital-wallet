import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { WalletEvent } from 'src/shared/enums';
import { ITransactionRequestDto } from 'src/shared/interfaces';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
	private readonly logger = new Logger(TransactionController.name);

	constructor(
		private readonly transactionService: TransactionService
	) {}

	@MessagePattern(WalletEvent.MAKE_TRANSACTION)
	async makeTransaction(
		@Payload() data: ITransactionRequestDto
	) {
		this.logger.log(`${WalletEvent.MAKE_TRANSACTION} ${JSON.stringify(data)}`);

		await this.transactionService.makeTransaction(data);
		
		return { message: 'Transaction completed' };
	}
}
