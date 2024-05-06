import { Inject, Injectable } from '@nestjs/common';
import { WalletEntity } from 'src/wallet/wallet.entity';
import { IWalletRepository } from 'src/wallet/wallet.repository';
import { TransactionFactory } from './entities/transaction.factory';

@Injectable()
export class TransactionService {
	constructor(
		@Inject('IWalletRepository')
		private readonly walletRepository: IWalletRepository
	) {}
	async makeTransaction(wallet: WalletEntity, data: { operationType: string; amount: number }) {
		const trxContext = new TransactionFactory();
		const transaction = trxContext.createTransaction(data.operationType, data.amount, wallet.getBalance());

		return this.walletRepository.update(wallet.getId(), transaction.balance);
	}
}
