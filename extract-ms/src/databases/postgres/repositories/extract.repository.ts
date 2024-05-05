import { ExtractEntity } from "src/extract/extract.entity";
import { IExtractRepository } from "src/extract/extract.repository";
import { Pg } from "../Pg";

export class ExtractPgRepository implements IExtractRepository {
	pg: Pg;

	constructor() {
		this.pg = Pg.getInstance();
	}

	async find(walletId: string): Promise<ExtractEntity[] | null> {
		// TODO: implement pagination
		const { rows } = await this.pg.query('SELECT * FROM extracts WHERE wallet_id = $1', [walletId]);
		if (rows.length === 0) {
			return null;
		}

		return rows.map((row) => {
			const { id, wallet_id, amount, type, created_at } = row;
			return new ExtractEntity(id, wallet_id, type, amount);
		});
	}
}