import { Inject, Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { IWalletRepository } from "./wallet.repository";

@Injectable()
export class WalletService {
	constructor(
		@Inject('IWalletRepository')
		private readonly walletRepository: IWalletRepository
	) {}

  	async getWallet(id: string) {
		const wallet = await this.walletRepository.find(id);

		if (!wallet)
			throw new RpcException(`Wallet with ID ${id} not found`);

		const mapToResponse = {
			id: wallet.getId(),
			balance: wallet.getBalance()
		};

		return mapToResponse;
  	}
}