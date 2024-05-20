import { Controller, Logger } from "@nestjs/common";
import { MessagePattern, Payload, RpcException } from "@nestjs/microservices";
import { WalletEvent } from "src/shared/enums";
import { FindResponseDto } from "./wallet.dto";
import { WalletService } from "./wallet.service";

@Controller('wallet')
export class WalletController {
	private readonly logger = new Logger(WalletController.name);

	constructor(private readonly walletService: WalletService) {}

	@MessagePattern(WalletEvent.FIND_BALANCE)
	async find(@Payload() data: { walletId: string}): Promise<FindResponseDto> {
		this.logger.log(`${WalletEvent.FIND_BALANCE} ${data.walletId}`);
		const wallet = await this.walletService.getWallet(data.walletId);

		if (!wallet)
			throw new RpcException(`Wallet with ID ${data.walletId} not found`);

		const mapToResponse = {
			id: wallet.id,
			balance: wallet.balance
		};

		this.logger.log(`Response: ${JSON.stringify(mapToResponse)}`);

		return mapToResponse;
	}
}