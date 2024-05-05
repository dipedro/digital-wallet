import { Module } from '@nestjs/common';
import { WalletPgRepository } from 'src/infra/databases/postgres/repositories/wallet.repository';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';

@Module({
	controllers: [WalletController],
	providers: [
		WalletService,
		{
			provide: 'IWalletRepository',
			useClass: WalletPgRepository
		}
	]
})
export class WalletModule {}
