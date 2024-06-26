import { Module } from '@nestjs/common';
import { WalletModule } from './wallet/wallet.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), WalletModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
