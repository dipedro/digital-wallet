import { Controller, Get, HttpStatus, OnModuleInit, Param } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { FindExtractResponseDto, FindResponseDto } from './wallet.dto';

enum WALLET_EVENT {
	FIND_BALANCE = 'find-balance',
	FIND_EXTRACT = 'find-extract',
};

@ApiTags('Wallet')
@Controller('wallet')
export class WalletController implements OnModuleInit {
	@Client({
		transport: Transport.KAFKA,
		options: {
			client: {
				clientId: 'wallet',
				brokers: ['localhost:9092'],
			},
			consumer: {
				groupId: 'wallet-consumer',
				allowAutoTopicCreation: true,
			}
		}
	})
	private client: ClientKafka;

	async onModuleInit() {
		const eventNames = Object.values(WALLET_EVENT);

		eventNames.forEach(async (pattern) => {
			this.client.subscribeToResponseOf(pattern);
			await this.client.connect();
		});
	}

	@Get(':id')
	@ApiResponse({ status: HttpStatus.OK, type: FindResponseDto })
	find(@Param('id') customerId: number): Observable<FindResponseDto> {
		return this.client.send(WALLET_EVENT.FIND_BALANCE, {
			customerId,
		});
	}

	@Get(':id/extract')
	@ApiResponse({ status: HttpStatus.OK, type: FindExtractResponseDto })
	findExtract(@Param('id') customerId: number): Observable<FindExtractResponseDto> {
		return this.client.send(WALLET_EVENT.FIND_EXTRACT, {
			customerId,
		});
	}
}
