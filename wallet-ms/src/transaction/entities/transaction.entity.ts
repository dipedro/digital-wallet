import { OperationType } from "src/shared/enums";
import { ITransactionStrategy } from "../interfaces/transaction.interface";

export class Transaction {
    private strategy: ITransactionStrategy;

    constructor(
		public operationType: OperationType, 
		public amount: number, 
        public id?: string
	) {}

    setStrategy(strategy: ITransactionStrategy): void {
        this.strategy = strategy;
    }

    makeTransaction(balance: number): number {
        return this.strategy.execute(this, balance);
    }
}