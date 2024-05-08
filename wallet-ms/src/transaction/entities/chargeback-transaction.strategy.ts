import { OperationType } from "src/shared/enums";
import { Transaction, TransactionStrategy } from "../transaction.interface";

export class ChargebackTransactionStrategy implements TransactionStrategy {
	createTransaction(amount: number, balance: number): Transaction {
		return {
			balance: balance + amount,
			amount,
			operationType: OperationType.CHARGEBACK
		};
	}
}