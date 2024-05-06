export interface Transaction {
    amount: number;
    operationType: string;
	balance: number;
}

export interface TransactionStrategy {
    createTransaction(amount: number, balance: number): Transaction;
}