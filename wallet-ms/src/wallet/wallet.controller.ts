import { Controller, Logger } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { WalletEvent } from "./enums";
import { FindResponseDto } from "./wallet.dto";
import { WalletService } from "./wallet.service";

@Controller('wallet')
export class WalletController {
	constructor(private readonly walletService: WalletService) {}

	private readonly logger = new Logger(WalletController.name);

	@MessagePattern(WalletEvent.FIND_BALANCE)
	async find(@Payload() data: { walletId: string}): Promise<FindResponseDto> {
		this.logger.log(`${WalletEvent.FIND_BALANCE} ${data.walletId}`);
		const res = await this.walletService.getWallet(data.walletId);

		const mapToResponse = {
			id: res.getId(),
			balance: res.getBalance()
		};

		this.logger.log(`Response: ${JSON.stringify(mapToResponse)}`);

		return mapToResponse;
	}
}