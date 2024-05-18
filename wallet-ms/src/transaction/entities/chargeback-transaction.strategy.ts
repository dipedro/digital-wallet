import { RpcException } from "@nestjs/microservices";
import { ITransactionStrategy } from "../interfaces/transaction.interface";
import { Transaction } from "./transaction.entity";

export class ChargebackTransactionStrategy implements ITransactionStrategy {
	execute(transaction: Transaction, balance: number): number {

		if (!transaction.id)
			throw new RpcException("Transaction ID is required");

		const newBalance = balance + transaction.amount;

		return newBalance;
	}
}