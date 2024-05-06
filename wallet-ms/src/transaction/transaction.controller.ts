import { Controller, Logger, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, MessagePattern, Payload, Transport } from '@nestjs/microservices';
import { WalletEvent } from 'src/wallet/enums';
import { WalletService } from 'src/wallet/wallet.service';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController implements OnModuleInit {
	@Client({
		transport: Transport.KAFKA,
		options: {
		  client: {
			clientId: 'extract',
			brokers: ['localhost:9092'],
		  },
		  consumer: {
			groupId: 'extract-consumer',
			allowAutoTopicCreation: true
		  }
		}
	})
	private clientExtract: ClientKafka;

	private readonly logger = new Logger(TransactionController.name);

	constructor(
		private readonly walletService: WalletService,
		private readonly transactionService: TransactionService
	) {}

	async onModuleInit() {
		this.clientExtract.subscribeToResponseOf('add-transaction');
		await this.clientExtract.connect();
	}

	@MessagePattern(WalletEvent.MAKE_TRANSACTION)
	async makeTransaction(
		@Payload() data: { walletId: string; operationType: string; amount: number }
	) {
		this.logger.log(`${WalletEvent.MAKE_TRANSACTION} ${JSON.stringify(data)}`);
		const wallet = await this.walletService.getWallet(data.walletId);

		await this.transactionService.makeTransaction(wallet, data);

		this.clientExtract.emit(WalletEvent.ADD_TRANSACTION, {
			walletId: data.walletId,
			operationType: data.operationType,
			amount: data.amount
		});
		
		return { message: 'Transaction completed' };
	}
}
