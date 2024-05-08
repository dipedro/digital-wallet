import { Test, TestingModule } from '@nestjs/testing';
import { WalletEntity } from 'src/wallet/wallet.entity';
import { WalletService } from '../wallet/wallet.service';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

describe('TransactionController', () => {
  let controller: TransactionController;
  let walletService: WalletService;
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
    walletService = module.get<WalletService>(WalletService);
    transactionService = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('makeTransaction', () => {
    it('should make a transaction and emit an event', async () => {
      const walletId = 'test-wallet-id';
      const balance = 500;
      const operationType = 'test-operation';
      const amount = 100;

      const wallet = new WalletEntity( walletId, balance);
      const data = { walletId, operationType, amount };

      jest.spyOn(walletService, 'getWallet').mockResolvedValue(wallet);
      jest.spyOn(transactionService, 'makeTransaction').mockResolvedValue(undefined);
      jest.spyOn(controller['clientExtract'], 'emit').mockImplementation(() => null);

      const result = await controller.makeTransaction(data);

      expect(walletService.getWallet).toHaveBeenCalledWith(walletId);
      expect(transactionService.makeTransaction).toHaveBeenCalledWith(wallet, data);
      expect(controller['clientExtract'].emit).toHaveBeenCalledWith('add-transaction', {
        walletId,
        operationType,
        amount,
      });
      expect(result).toEqual({ message: 'Transaction completed' });
    });

    it('should throw an error if wallet is not found', async () => {
      const walletId = 'test-wallet-id';
      const operationType = 'test-operation';
      const amount = 100;

      const data = { walletId, operationType, amount };

      jest.spyOn(walletService, 'getWallet').mockResolvedValue(undefined);

      await expect(controller.makeTransaction(data)).rejects.toThrow(
        `Wallet with ID ${walletId} not found`,
      );

      expect(walletService.getWallet).toHaveBeenCalledWith(walletId);
      expect(transactionService.makeTransaction).not.toHaveBeenCalled();
      expect(controller['clientExtract'].emit).not.toHaveBeenCalled();
    });
  });
});