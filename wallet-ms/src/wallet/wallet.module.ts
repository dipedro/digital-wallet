import { Module } from '@nestjs/common';
import { WalletPgRepository } from 'src/infra/databases/postgres/repositories/wallet.repository';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
	controllers: [WalletController],
	providers: [
		WalletService,
		{
			provide: 'IWalletRepository',
			useClass: WalletPgRepository
		}
	],
	exports: [
		WalletService,
		{
			provide: 'IWalletRepository',
			useClass: WalletPgRepository
		}
	]
})
export class WalletModule {}
