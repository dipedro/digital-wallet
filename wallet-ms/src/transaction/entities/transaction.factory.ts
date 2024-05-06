import { OperationType } from "src/wallet/enums";
import { Transaction, TransactionStrategy } from "../transaction.interface";
import { CancellationTransactionStrategy } from "./cancellation-transaction.strategy";
import { ChargebackTransactionStrategy } from "./chargeback-transaction.strategy";
import { DepositTransactionStrategy } from "./deposit-transaction.strategy";
import { PurchaseTransactionStrategy } from "./purchase-transaction.strategy";
import { WithdrawTransactionStrategy } from "./withdraw-transaction.strategy";
import { RpcException } from "@nestjs/microservices";

export class TransactionFactory {
    private strategies: { [key: string]: TransactionStrategy } = {
        [OperationType.DEPOSIT]: new DepositTransactionStrategy(),
        [OperationType.WITHDRAW]: new WithdrawTransactionStrategy(),
		[OperationType.PURCHASE]: new PurchaseTransactionStrategy(),
		[OperationType.CANCELLATION]: new CancellationTransactionStrategy(),
		[OperationType.CHARGEBACK]: new ChargebackTransactionStrategy()
    };

    public createTransaction(operationType: string, amount: number, balance: number): Transaction {
        const strategy = this.strategies[operationType];

        if (!strategy)
            throw new RpcException(`Invalid operation type: ${operationType}`);

        return strategy.createTransaction(amount, balance);
    }
}