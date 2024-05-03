import { Controller, Get, HttpStatus, OnModuleInit, Param } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { WalletEvent } from './enums';
import { FindExtractResponseDto, FindResponseDto } from './wallet.dto';

@ApiTags('Wallet')
@Controller('wallet')
export class WalletController implements OnModuleInit {
	@Client({
		transport: Transport.KAFKA,
		options: {
			client: {
				clientId: 'wallet',
				brokers: ['localhost:9092'], //TODO: adicionar variável de ambiente
			},
			consumer: {
				groupId: 'wallet-consumer',
				allowAutoTopicCreation: true,
			}
		}
	})
	private client: ClientKafka;

	async onModuleInit() {
		const eventNames = Object.values(WalletEvent);

		eventNames.forEach(async (pattern) => {
			this.client.subscribeToResponseOf(pattern);
			await this.client.connect();
		});
	}

	@Get(':id')
	@ApiResponse({ status: HttpStatus.OK, type: FindResponseDto })
	find(@Param('id') walletId: number): Observable<FindResponseDto> {
		return this.client.send(WalletEvent.FIND_BALANCE, {
			walletId,
		});
	}

	@Get(':id/extract')
	@ApiResponse({ status: HttpStatus.OK, type: FindExtractResponseDto })
	findExtract(@Param('id') walletId: number): Observable<FindExtractResponseDto> {
		return this.client.send(WalletEvent.FIND_EXTRACT, {
			walletId,
		});
	}
}
