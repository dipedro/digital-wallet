import { Inject, Injectable } from "@nestjs/common";
import { IWalletRepository } from "./wallet.repository";

@Injectable()
export class WalletService {
	constructor(
		@Inject('IWalletRepository')
		private readonly walletRepository: IWalletRepository
	) {}

  	async getWallet(id: string) {
		return this.walletRepository.find(id);
  	}
}