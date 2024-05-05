// TODO: refac
export class ExtractEntity {
	id: string;
	walletId: string;
	type: string;
	amount: number;
	createdAt: Date;

	constructor(id, walletId, type, amount) {
		this.id = id;
		this.walletId = walletId;
		this.type = type;
		this.amount = amount;
		this.createdAt = new Date();
	}
}