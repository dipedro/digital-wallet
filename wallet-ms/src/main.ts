import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { AppModule } from './app.module';

const logger = new Logger('WalletMicroservice');

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
		options: {
			client: {
				clientId: 'wallet',
				brokers: [process.env.KAFKA_HOST],
			},
			consumer: {
				groupId: 'wallet-consumer',
				allowAutoTopicCreation: true
			},
			producer: {
				createPartitioner: Partitioners.LegacyPartitioner 
			}
		}
  });

  await app.listen();
  logger.log('Wallet Microservice is running');
}
bootstrap();
