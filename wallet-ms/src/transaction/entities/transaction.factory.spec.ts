import { RpcException } from '@nestjs/microservices';
import { OperationType } from 'src/shared/enums';
import { TransactionFactory } from './transaction.factory';

describe('TransactionFactory', () => {
  let transactionFactory: TransactionFactory;

  beforeEach(() => {
    transactionFactory = new TransactionFactory();
  });

  describe('createTransaction', () => {
    it('should create a deposit transaction', () => {
      const operationType = OperationType.DEPOSIT;
      const amount = 100;
      const balance = 500;

      const transaction = transactionFactory.createTransaction(operationType, amount, balance);

      expect(transaction.amount).toBe(amount);
      expect(transaction.balance).toBe(amount + balance);
      expect(transaction.operationType).toBe(operationType);
    });

    it('should create a withdraw transaction', () => {
      const operationType = OperationType.WITHDRAW;
      const amount = 50;
      const balance = 200;

      const transaction = transactionFactory.createTransaction(operationType, amount, balance);

      expect(transaction.amount).toBe(amount);
      expect(transaction.balance).toBe(balance - amount);
      expect(transaction.operationType).toBe(operationType);
    });

    it('should create a purchase transaction', () => {
      const operationType = OperationType.PURCHASE;
      const amount = 75;
      const balance = 300;

      const transaction = transactionFactory.createTransaction(operationType, amount, balance);

      expect(transaction.amount).toBe(amount);
      expect(transaction.balance).toBe(balance - amount);
      expect(transaction.operationType).toBe(operationType);
    });

    it('should create a cancellation transaction', () => {
      const operationType = OperationType.CANCELLATION;
      const amount = 25;
      const balance = 150;

      const transaction = transactionFactory.createTransaction(operationType, amount, balance);

      expect(transaction.amount).toBe(amount);
      expect(transaction.balance).toBe(balance + amount);
      expect(transaction.operationType).toBe(operationType);
    });

    it('should create a chargeback transaction', () => {
      const operationType = OperationType.CHARGEBACK;
      const amount = 200;
      const balance = 1000;

      const transaction = transactionFactory.createTransaction(operationType, amount, balance);

      expect(transaction.amount).toBe(amount);
      expect(transaction.balance).toBe(balance + amount);
      expect(transaction.operationType).toBe(operationType);
    });

    it('should throw an error for an invalid operation type', () => {
      const operationType = 'invalid';
      const amount = 100;
      const balance = 500;

      expect(() => {
        transactionFactory.createTransaction(operationType, amount, balance);
      }).toThrow(RpcException);
    });
  });
});