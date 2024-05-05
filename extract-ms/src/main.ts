import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { AppModule } from './app.module';

const logger = new Logger('ExtractMicroservice');

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
		options: {
			client: {
				clientId: 'extract',
				brokers: ['localhost:9092'],
			},
			consumer: {
				groupId: 'extract-consumer',
				allowAutoTopicCreation: true
			},
			producer: {
				createPartitioner: Partitioners.LegacyPartitioner 
			}
		}
  });

  await app.listen();
  logger.log('Extract Microservice is running');
}
bootstrap();