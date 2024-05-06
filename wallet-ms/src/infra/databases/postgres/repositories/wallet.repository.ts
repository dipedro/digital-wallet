import { WalletEntity } from "src/wallet/wallet.entity";
import { IWalletRepository } from "src/wallet/wallet.repository";
import { Pg } from "../Pg";

export class WalletPgRepository implements IWalletRepository {
	pg: Pg;

	constructor() {
		this.pg = Pg.getInstance();
	}

	async find(id: string): Promise<WalletEntity | null> {
		const { rows } = await this.pg.query('SELECT * FROM wallets WHERE id = $1 LIMIT 1', [id]);
		if (rows.length === 0) {
			return null;
		}

		const { id: walletId, balance } = rows[0];
		return new WalletEntity(walletId, Number(balance));
	}

	async update(id: string, balance: number): Promise<void> {
		await this.pg.query('UPDATE wallets SET balance = $1 WHERE id = $2', [balance, id]);
	}
}