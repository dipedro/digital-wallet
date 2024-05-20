import { ISelectOptions } from "src/shared/interfaces";
import { WalletEntity } from "./wallet.entity";

export interface IWalletRepository {
	find(id: string, options?: ISelectOptions): Promise<WalletEntity | null>;
	update(id: string, balance: number): Promise<void>;
}