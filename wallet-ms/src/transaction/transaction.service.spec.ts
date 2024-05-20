import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';

describe('TransactionService', () => {
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: 'IWalletRepository',
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: 'IDBService',
          useValue: {
            transaction: jest.fn(),
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

    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
