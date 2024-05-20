import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { IDBService } from 'src/infra/databases/postgres/pg.service';
import { WalletEvent } from 'src/shared/enums';
import { ITransactionRequestDto } from 'src/shared/interfaces';
import { IWalletRepository } from 'src/wallet/wallet.repository';
import { Transaction } from './entities/transaction.entity';
import { TransactionFactory } from './entities/transaction.factory';


@Injectable()
export class TransactionService {

	private logger = new Logger(TransactionService.name);

	constructor(
		@Inject('IWalletRepository')
		private readonly walletRepository: IWalletRepository,
		@Inject('EXTRACT_MS')
		private readonly clientExtract: ClientProxy,
		@Inject('IDBService')
		private readonly dbService: IDBService
	) {}
	
	async makeTransaction({ walletId, operationType, amount }: ITransactionRequestDto) {
		this.logger.log(`makeTransaction request received: ${walletId} - ${operationType} - ${amount}`);
		try {

			
			await this.dbService.transaction(async () => {
				this.logger.log('DB transaction started');

				const wallet = await this.walletRepository.find(walletId, { lock: true, isTransaction: true });
		
				if (!wallet) {
					throw new RpcException(`Wallet with ID ${walletId} not found`);
				}
				
				const strategy = TransactionFactory.execute(operationType);
		
				const transaction = new Transaction(operationType, amount, wallet.getId());
				transaction.setStrategy(strategy);
				
				const newBalance = transaction.makeTransaction(wallet.getBalance());
		
				await this.walletRepository.update(wallet.getId(), newBalance);
			});
	
			this.clientExtract.emit(WalletEvent.ADD_TRANSACTION, {
				walletId: walletId,
				operationType: operationType,
				amount: amount
			});
		} catch (error) {
			throw new RpcException(error.message);
		}
	}
}
