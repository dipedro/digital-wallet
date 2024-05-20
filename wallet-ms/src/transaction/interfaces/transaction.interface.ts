import { Transaction } from "../entities/transaction.entity";

export interface ITransactionStrategy {
    execute(transaction: Transaction, balance: number): number;
}