import { RpcException } from "@nestjs/microservices";
import { OperationType } from "src/shared/enums";
import { ITransactionStrategy } from "../interfaces/transaction.interface";
import { CancellationTransactionStrategy } from "./cancellation-transaction.strategy";
import { ChargebackTransactionStrategy } from "./chargeback-transaction.strategy";
import { DepositTransactionStrategy } from "./deposit-transaction.strategy";
import { PurchaseTransactionStrategy } from "./purchase-transaction.strategy";
import { WithdrawTransactionStrategy } from "./withdraw-transaction.strategy";

export class TransactionFactory {
    static execute(operationType: OperationType): ITransactionStrategy {
        const strategies: { [key: string]: ITransactionStrategy } = {
            [OperationType.DEPOSIT]: new DepositTransactionStrategy(),
            [OperationType.WITHDRAW]: new WithdrawTransactionStrategy(),
            [OperationType.PURCHASE]: new PurchaseTransactionStrategy(),
            [OperationType.CANCELLATION]: new CancellationTransactionStrategy(),
            [OperationType.CHARGEBACK]: new ChargebackTransactionStrategy()
        };
        const strategy = strategies[operationType];

        if (!strategy)
            throw new RpcException(`Invalid operation type: ${operationType}`);

        return strategy;
    }
}