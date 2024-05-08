import { BadRequestException, Body, Controller, Get, HttpStatus, NotFoundException, OnModuleInit, Param, Post } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Partitioners } from 'kafkajs';
import { Observable, catchError } from 'rxjs';
import { WalletEvent } from './enums';
import { FindExtractResponseDto, FindResponseDto, MakeTransactionRequestDto, MakeTransactionResponseDto } from './wallet.dto';

@ApiTags('Wallet')
@Controller('wallets')
export class WalletController implements OnModuleInit {
	@Client({
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
	})
	private clientWallet: ClientKafka;

	@Client({
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
	})
	private clientExtract: ClientKafka;

	async onModuleInit() {
		this.clientWallet.subscribeToResponseOf(WalletEvent.FIND_BALANCE);
		this.clientWallet.subscribeToResponseOf(WalletEvent.MAKE_TRANSACTION);
		this.clientExtract.subscribeToResponseOf(WalletEvent.FIND_EXTRACT);
		await this.clientWallet.connect();
		await this.clientExtract.connect();
	}

	@Get(':id')
	@ApiResponse({ status: HttpStatus.OK, type: FindResponseDto })
	find(@Param('id') walletId: string): Observable<FindResponseDto> {
		return this.clientWallet.send(WalletEvent.FIND_BALANCE, {
			walletId,
		}).pipe(
			catchError((error) => {
				throw new NotFoundException(error?.message || `Wallet not found`);
			})
		);
	}
	
	@Get(':id/extract')
	@ApiResponse({ status: HttpStatus.OK, type: FindExtractResponseDto })
	findExtract(@Param('id') walletId: string): Observable<FindExtractResponseDto[]> {
		return this.clientExtract.send(WalletEvent.FIND_EXTRACT, {
			walletId,
		}).pipe(
			catchError((error) => {
			  	throw new NotFoundException(error?.message || `Wallet not found`);
			})
		);
	}

	@Post(':id/transaction')
	@ApiResponse({ status: HttpStatus.CREATED, type: MakeTransactionResponseDto })
	makeTransaction(
		@Param('id') walletId: string,
		@Body() makeTransactionRequestDto: MakeTransactionRequestDto,
	): Observable<MakeTransactionResponseDto> {
		return this.clientWallet.send(WalletEvent.MAKE_TRANSACTION, {
			walletId,
			...makeTransactionRequestDto
		}).pipe(
			catchError((error) => {
				throw new BadRequestException(error?.message || `Error making transaction`);
			})
		);
	}
}