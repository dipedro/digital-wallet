import { Test, TestingModule } from '@nestjs/testing';
import { OperationType } from 'src/shared/enums';
import { WalletService } from '../wallet/wallet.service';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

describe('TransactionController', () => {
  let controller: TransactionController;
  let transactionService: TransactionService;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        WalletService, 
        {
          provide: TransactionService,
          useValue: {
            makeTransaction: jest.fn(),
          }
        },
        {
          provide: 'IWalletRepository',
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: 'EXTRACT_MS',
          useValue: {
            emit: jest.fn(),
          }
        }
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    transactionService = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('makeTransaction', () => {
    it('should make a transaction and emit an event', async () => {
      const walletId = 'test-wallet-id';
      const operationType = 'test-operation' as OperationType;
      const amount = 100;

      const data = { walletId, operationType, amount };

      jest.spyOn(transactionService, 'makeTransaction').mockResolvedValue(undefined);

      const result = await controller.makeTransaction(data);

      expect(transactionService.makeTransaction).toHaveBeenCalledWith(data);
      expect(result).toEqual({ message: 'Transaction completed' });
    });
  });
});