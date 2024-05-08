import { Controller, Inject, Logger } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { WalletEvent } from 'src/shared/enums';
import { WalletService } from 'src/wallet/wallet.service';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
	private readonly logger = new Logger(TransactionController.name);

	constructor(
		@Inject('EXTRACT_MS')
		private readonly clientExtract: ClientProxy,
		private readonly walletService: WalletService,
		private readonly transactionService: TransactionService
	) {}

	@MessagePattern(WalletEvent.MAKE_TRANSACTION)
	async makeTransaction(
		@Payload() data: { walletId: string; operationType: string; amount: number }
	) {
		this.logger.log(`${WalletEvent.MAKE_TRANSACTION} ${JSON.stringify(data)}`);
		const wallet = await this.walletService.getWallet(data.walletId);

		if (!wallet)
			throw new RpcException(`Wallet with ID ${data.walletId} not found`);

		await this.transactionService.makeTransaction(wallet, data);

		this.clientExtract.emit(WalletEvent.ADD_TRANSACTION, {
			walletId: data.walletId,
			operationType: data.operationType,
			amount: data.amount
		});
		
		return { message: 'Transaction completed' };
	}
}
