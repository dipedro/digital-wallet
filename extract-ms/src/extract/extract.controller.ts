import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { WalletEvent } from './enums';
import { FindResponseDto } from './extract.dto';
import { ExtractService } from './extract.service';

@Controller('extract')
export class ExtractController {
	constructor(private readonly extractService: ExtractService) {}

	private readonly logger = new Logger(ExtractController.name);

	@MessagePattern(WalletEvent.FIND_EXTRACT)
	async find(@Payload() data: { walletId: string}): Promise<FindResponseDto[]> {
		this.logger.log(`${WalletEvent.FIND_EXTRACT} ${data.walletId}`);
		const wallet = await this.extractService.getExtract(data.walletId);

		if (!wallet)
			throw new RpcException(`Wallet with ID ${data.walletId} not found`);

		const mapToResponse = wallet.map((extract) => {
			return {
				id: extract.id,
				amount: extract.amount,
				type: extract.type,
				createdAt: extract.createdAt,
				walletId: extract.walletId,
			} as FindResponseDto;
		});

		this.logger.log(`Response: ${JSON.stringify(mapToResponse)}`);

		return mapToResponse;
	}

	@EventPattern(WalletEvent.ADD_TRANSACTION)
	async create(
		@Payload() data: { walletId: string; operationType: string; amount: number }
	) {
		this.logger.log(`${WalletEvent.ADD_TRANSACTION} ${JSON.stringify(data)}`);
		await this.extractService.addTransaction(data);
	}
	
}
