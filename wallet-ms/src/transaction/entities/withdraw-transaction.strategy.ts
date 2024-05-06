import { OperationType } from "src/wallet/enums";
import { Transaction, TransactionStrategy } from "../transaction.interface";

export class WithdrawTransactionStrategy implements TransactionStrategy {
    createTransaction(amount: number, balance: number): Transaction {

		if (amount > balance) {
			throw new Error("Insufficient funds");
		}

        return {
			balance: balance - amount,
            amount,
            operationType: OperationType.WITHDRAW
        };
    }
}