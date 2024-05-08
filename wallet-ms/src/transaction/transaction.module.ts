import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { WalletModule } from 'src/wallet/wallet.module';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [
    ClientsModule.register([
      { 
        name: 'EXTRACT_MS',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'extract',
            brokers: [process.env.KAFKA_HOST],
          },
          consumer: {
            groupId: 'extract-consumer',
            allowAutoTopicCreation: true
          },
          producer: {
            createPartitioner: Partitioners.LegacyPartitioner
          }
        }
      },
    ]),
    WalletModule
  ],
  controllers: [TransactionController],
  providers: [TransactionService]
})
export class TransactionModule {}
