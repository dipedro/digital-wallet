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
    it('should find the wallet balance', async () => {
      const walletId = 'test-wallet-id';

      await controller.find({walletId});

      expect(walletService.getWallet).toHaveBeenCalledWith(walletId);
    });
  });
});