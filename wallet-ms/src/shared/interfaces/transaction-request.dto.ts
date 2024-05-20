import { OperationType } from "../enums";

export interface ITransactionRequestDto {
	walletId: string;
	operationType: OperationType;
	amount: number;
}