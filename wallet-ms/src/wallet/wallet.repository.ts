import { WalletEntity } from "./wallet.entity";

export interface IWalletRepository {
	find(id: string): Promise<WalletEntity | null>;
}