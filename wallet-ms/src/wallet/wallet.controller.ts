import { Controller, Logger, OnModuleInit } from "@nestjs/common";
import { Client, ClientKafka, MessagePattern, Payload, RpcException, Transport } from "@nestjs/microservices";
import { WalletEvent } from "./enums";
import { FindResponseDto } from "./wallet.dto";
import { WalletService } from "./wallet.service";

@Controller('wallet')
export class WalletController implements OnModuleInit {
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
		  }
		}
	})
	private clientExtract: ClientKafka;

	private readonly logger = new Logger(WalletController.name);

	constructor(private readonly walletService: WalletService) {}

	async onModuleInit() {
		this.clientExtract.subscribeToResponseOf(WalletEvent.ADD_TRANSACTION);
		await this.clientExtract.connect();
	}

	@MessagePattern(WalletEvent.FIND_BALANCE)
	async find(@Payload() data: { walletId: string}): Promise<FindResponseDto> {
		this.logger.log(`${WalletEvent.FIND_BALANCE} ${data.walletId}`);
		const wallet = await this.walletService.getWallet(data.walletId);

		if (!wallet)
			throw new RpcException(`Wallet with ID ${data.walletId} not found`);

		const mapToResponse = {
			id: wallet.getId(),
			balance: wallet.getBalance()
		};

		this.logger.log(`Response: ${JSON.stringify(mapToResponse)}`);

		return mapToResponse;
	}

	@MessagePattern(WalletEvent.MAKE_TRANSACTION)
	async makeTransaction(
		@Payload() data: { walletId: string; operationType: string; amount: number }
	) {
		this.logger.log(`${WalletEvent.MAKE_TRANSACTION} ${JSON.stringify(data)}`);
		const wallet = await this.walletService.getWallet(data.walletId);

		await this.walletService.makeTransaction(wallet, data);

		this.clientExtract.emit(WalletEvent.ADD_TRANSACTION, {
			walletId: data.walletId,
			operationType: data.operationType,
			amount: data.amount
		});
		
		return { message: 'Transaction completed' };
	}
}