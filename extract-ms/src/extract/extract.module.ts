import { Module } from '@nestjs/common';
import { ExtractPgRepository } from 'src/infra/databases/postgres/repositories/extract.repository';
import { ExtractController } from './extract.controller';
import { ExtractService } from './extract.service';

@Module({
  controllers: [ExtractController],
  providers: [
    ExtractService, 
    {
      provide: 'IExtractRepository',
      useClass: ExtractPgRepository
    }
  ]
})
export class ExtractModule {}
