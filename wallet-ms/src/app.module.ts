import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DBModule } from './infra/databases/db.module';
import { TransactionModule } from './transaction/transaction.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    WalletModule, 
    TransactionModule,
    DBModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
