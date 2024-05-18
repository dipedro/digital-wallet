import { ITransactionStrategy } from "../interfaces/transaction.interface";
import { Transaction } from "./transaction.entity";

export class DepositTransactionStrategy implements ITransactionStrategy {

    execute(transaction: Transaction, balance: number): number {
        const newBalance = balance + transaction.amount;
        return newBalance;
    }
}