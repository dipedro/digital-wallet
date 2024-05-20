
import { Global, Module } from '@nestjs/common';
import { PGService } from './postgres/pg.service';

@Global()
@Module({
	providers: [
		PGService,
		{
			provide: 'IDBService',
			useClass: PGService
		}
	],
	exports: [
		PGService, 
		'IDBService'
	]
})
export class DBModule {}