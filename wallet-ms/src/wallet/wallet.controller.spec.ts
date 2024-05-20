import { Test, TestingModule } from '@nestjs/testing';

import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

describe('WalletController', () => {
  let controller: WalletController;
  let walletService: WalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletController],
      providers: [
        {
          provide: 'IWalletRepository',
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: WalletService,
          useValue: {
            getWallet: jest.fn(),
          }
        },
      ],
    }).compile();

    controller = module.get<WalletController>(WalletController);
    walletService = module.get<WalletService>(WalletService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('find', () => {
    it('should call find the wallet balance with error', async () => {
      const walletId = 'test-wallet-id';

      expect(controller.find({ walletId })).rejects.toThrow(`Wallet with ID ${walletId} not found`)

      expect(walletService.getWallet).toHaveBeenCalledWith(walletId);
    });

    it('should find wallet balance with success', async () => {
      const walletId = 'test-wallet-id';

      const walletMock = {
        id: walletId,
        balance: 100
      };

      jest.spyOn(walletService, 'getWallet').mockResolvedValue(walletMock);

      const result = await controller.find({ walletId });

      expect(result).toEqual(walletMock);

      expect(walletService.getWallet).toHaveBeenCalledWith(walletId);
    });
  });
});