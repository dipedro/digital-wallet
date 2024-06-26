import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ExtractModule } from './extract/extract.module';
@Module({
  imports: [ConfigModule.forRoot(), ExtractModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
