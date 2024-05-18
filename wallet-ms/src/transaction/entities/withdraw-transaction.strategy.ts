import { RpcException } from "@nestjs/microservices";
import { ITransactionStrategy } from "../interfaces/transaction.interface";
import { Transaction } from "./transaction.entity";

export class WithdrawTransactionStrategy implements ITransactionStrategy {
    execute(transaction: Transaction, balance: number): number {

        if (transaction.amount > balance)
            throw new RpcException("Insufficient funds");

        const newBalance = balance - transaction.amount;
        return newBalance;
    }
}