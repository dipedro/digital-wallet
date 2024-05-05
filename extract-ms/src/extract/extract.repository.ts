import { ExtractEntity } from "./extract.entity";

export interface IExtractRepository {
	find(walletId: string): Promise<ExtractEntity[] | null>;
}