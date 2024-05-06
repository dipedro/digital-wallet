import { ExtractEntity } from "./extract.entity";

export interface IExtractRepository {
	find(walletId: string): Promise<ExtractEntity[] | null>;
	create(data: { walletId: string; operationType: string; amount: number }): Promise<void>;
}