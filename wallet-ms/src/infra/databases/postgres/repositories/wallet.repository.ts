import { Injectable } from "@nestjs/common";
import { ISelectOptions } from "src/shared/interfaces";
import { WalletEntity } from "src/wallet/wallet.entity";
import { IWalletRepository } from "src/wallet/wallet.repository";
import { PGService } from "../pg.service";

interface WalletRow {
	id: string;
	balance: number;
}
@Injectable()
export class WalletPgRepository implements IWalletRepository {
	constructor(
		private readonly pgService: PGService
	) {}

	async find(id: string, options?: ISelectOptions): Promise<WalletEntity | null> {

		let query = 'SELECT * FROM wallets WHERE id = $1 LIMIT 1';

		if (options?.lock) {
			query += ' FOR UPDATE';
		}

		const { rows } = await this.pgService.query<WalletRow>(query, [id], options);

		if (rows.length === 0) {
			return null;
		}

		const { id: walletId, balance } = rows[0];
		
		return new WalletEntity(Number(balance), walletId);
	}

	async update(id: string, balance: number): Promise<void> {
		await this.pgService.query('UPDATE wallets SET balance = $1 WHERE id = $2', [balance, id]);
	}
}