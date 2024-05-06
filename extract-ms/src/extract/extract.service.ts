import { Inject, Injectable } from '@nestjs/common';
import { IExtractRepository } from './extract.repository';

@Injectable()
export class ExtractService {
	constructor(
		@Inject('IExtractRepository')
		private readonly extractRepository: IExtractRepository
	) {}

  	async getExtract(id: string) {
		return this.extractRepository.find(id);
  	}

	async addTransaction(data: { walletId: string; operationType: string; amount: number }) {
		return this.extractRepository.create(data);
	}
}
