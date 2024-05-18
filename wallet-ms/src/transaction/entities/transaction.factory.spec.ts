import { RpcException } from '@nestjs/microservices';
import { OperationType } from 'src/shared/enums';
import { Transaction } from './transaction.entity';
import { TransactionFactory } from './transaction.factory';

describe('TransactionFactory', () => {

  describe('createTransaction', () => {
    it('should create a deposit transaction', () => {
      const operationType = OperationType.DEPOSIT;
      const amount = 100;
      const balance = 500;

      const strategy = TransactionFactory.execute(operationType);

      const transaction = new Transaction(operationType, amount);
      transaction.setStrategy(strategy);

      const newBalance = transaction.makeTransaction(balance);

      expect(transaction.amount).toBe(amount);
      expect(newBalance).toBe(amount + balance);
      expect(transaction.operationType).toBe(operationType);
    });

    it('should create a withdraw transaction', () => {
      const operationType = OperationType.WITHDRAW;
      const amount = 50;
      const balance = 200;

      const strategy = TransactionFactory.execute(operationType);

      const transaction = new Transaction(operationType, amount);
      transaction.setStrategy(strategy);

      const newBalance = transaction.makeTransaction(balance);

      expect(transaction.amount).toBe(amount);
      expect(newBalance).toBe(balance - amount);
      expect(transaction.operationType).toBe(operationType);
    });

    it('should create a purchase transaction', () => {
      const operationType = OperationType.PURCHASE;
      const amount = 75;
      const balance = 300;

      const strategy = TransactionFactory.execute(operationType);

      const transaction = new Transaction(operationType, amount);
      transaction.setStrategy(strategy);

      const newBalance = transaction.makeTransaction(balance);

      expect(transaction.amount).toBe(amount);
      expect(newBalance).toBe(balance - amount);
      expect(transaction.operationType).toBe(operationType);
    });

    it('should create a cancellation transaction', () => {
      const operationType = OperationType.CANCELLATION;
      const amount = 25;
      const balance = 150;
      const transactionId = 'test-transaction-id';

      const strategy = TransactionFactory.execute(operationType);

      const transaction = new Transaction(operationType, amount, transactionId);
      transaction.setStrategy(strategy);

      const newBalance = transaction.makeTransaction(balance);

      expect(transaction.amount).toBe(amount);
      expect(newBalance).toBe(balance + amount);
      expect(transaction.operationType).toBe(operationType);
    });

    it('should create a chargeback transaction', () => {
      const operationType = OperationType.CHARGEBACK;
      const amount = 200;
      const balance = 1000;
      const transactionId = 'test-transaction-id';

      const strategy = TransactionFactory.execute(operationType);

      const transaction = new Transaction(operationType, amount, transactionId);
      transaction.setStrategy(strategy);

      const newBalance = transaction.makeTransaction(balance);

      expect(transaction.amount).toBe(amount);
      expect(newBalance).toBe(balance + amount);
      expect(transaction.operationType).toBe(operationType);
    });

    it('should throw an error for missing transaction id when the operation type was CHARGEBACK', () => {
      const operationType = OperationType.CHARGEBACK;
      const amount = 200;
      const balance = 1000;

      const strategy = TransactionFactory.execute(operationType);

      const transaction = new Transaction(operationType, amount);
      transaction.setStrategy(strategy);

      expect(() => {
          transaction.makeTransaction(balance);
      }).toThrow(RpcException);
    });

    it('should throw an error for missing transaction id when the operation type was CANCELLATION', () => {
      const operationType = OperationType.CANCELLATION;
      const amount = 200;
      const balance = 1000;

      const strategy = TransactionFactory.execute(operationType);

      const transaction = new Transaction(operationType, amount);
      transaction.setStrategy(strategy);

      expect(() => {
          transaction.makeTransaction(balance);
      }).toThrow(RpcException);
    });

    it('should throw an error for an invalid operation type', () => {
      const operationType = 'invalid' as OperationType;

      expect(() => {
        TransactionFactory.execute(operationType);
      }).toThrow(RpcException);
    });
  });
});