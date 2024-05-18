import { RpcException } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';

import { IWalletRepository } from './wallet.repository';
import { WalletService } from './wallet.service';
import { WalletEntity } from './wallet.entity';

describe('WalletService', () => {
  let service: WalletService;
  let walletRepository: IWalletRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        {
          provide: 'IWalletRepository',
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
    walletRepository = module.get<IWalletRepository>('IWalletRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getWallet', () => {
	it('should return the wallet balance when wallet exists', async () => {
		const walletId = 'test-wallet-id';
		const balance = 100;
		const wallet = new WalletEntity(balance, walletId);
		
		jest.spyOn(walletRepository, 'find').mockResolvedValue(wallet);

		const result = await service.getWallet(walletId);

		expect(walletRepository.find).toHaveBeenCalledWith(walletId);
		expect(result).toEqual({ id: walletId, balance: 100 });
	});

    it('should throw an error when wallet does not exist', async () => {
		const walletId = 'test-wallet-id';
		
		jest.spyOn(walletRepository, 'find').mockResolvedValue(null);

		await expect(service.getWallet(walletId)).rejects.toThrow(
			new RpcException(`Wallet with ID ${walletId} not found`),
		);
    });
  });
});