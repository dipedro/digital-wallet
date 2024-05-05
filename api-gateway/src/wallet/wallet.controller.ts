import { Body, Controller, Get, HttpStatus, OnModuleInit, Param, Post } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Partitioners } from 'kafkajs';
import { Observable } from 'rxjs';
import { WalletEvent } from './enums';
import { FindExtractResponseDto, FindResponseDto, MakeTransactionRequestDto } from './wallet.dto';

@ApiTags('Wallet')
@Controller('wallets')
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
				allowAutoTopicCreation: true
			},
			producer: {
				createPartitioner: Partitioners.LegacyPartitioner 
			}
		}
	})
	private clientWallet: ClientKafka;

	@Client({
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
	})
	private clientExtract: ClientKafka;

	@Client({
		transport: Transport.KAFKA,
		options: {
			client: {
				clientId: 'trasanction',
				brokers: ['localhost:9092'],
			},
			consumer: {
				groupId: 'trasanction-consumer',
				allowAutoTopicCreation: true
			},
			producer: {
				createPartitioner: Partitioners.LegacyPartitioner,
				idempotent: true
			}
		}
	})
	private clientTransaction: ClientKafka;

	async onModuleInit() {
		this.clientWallet.subscribeToResponseOf(WalletEvent.FIND_BALANCE);
		this.clientExtract.subscribeToResponseOf(WalletEvent.FIND_EXTRACT);
		this.clientTransaction.subscribeToResponseOf(WalletEvent.MAKE_TRANSACTION);
		await this.clientWallet.connect();
		await this.clientExtract.connect();
		await this.clientTransaction.connect();
	}

	@Get(':id')
	@ApiResponse({ status: HttpStatus.OK, type: FindResponseDto })
	find(@Param('id') walletId: string): Observable<FindResponseDto> {
		return this.clientWallet.send(WalletEvent.FIND_BALANCE, {
			walletId,
		});
	}
	
	@Get(':id/extract')
	@ApiResponse({ status: HttpStatus.OK, type: FindExtractResponseDto })
	findExtract(@Param('id') walletId: string): Observable<FindExtractResponseDto[]> {
		return this.clientExtract.send(WalletEvent.FIND_EXTRACT, {
			walletId,
		});
	}

	@Post(':id/transaction')
	@ApiResponse({ status: HttpStatus.CREATED })
	createTransaction(
		@Param('id') walletId: string,
		@Body() makeTransactionRequestDto: MakeTransactionRequestDto,
	): Observable<void> {
		return this.clientWallet.send(WalletEvent.MAKE_TRANSACTION, {
			walletId,
			...makeTransactionRequestDto
		});
	}
}
