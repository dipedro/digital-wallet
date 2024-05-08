import { RpcException } from "@nestjs/microservices";
import { OperationType } from "src/shared/enums";
import { Transaction, TransactionStrategy } from "../transaction.interface";

export class PurchaseTransactionStrategy implements TransactionStrategy {
	createTransaction(amount: number, balance: number): Transaction {

		if (amount > balance) {
			throw new RpcException("Insufficient funds");
		}

		return {
			balance: balance - amount,
			amount,
			operationType: OperationType.PURCHASE
		};
	}
}