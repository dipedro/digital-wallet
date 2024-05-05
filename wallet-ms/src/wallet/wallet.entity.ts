export class WalletEntity {

	constructor(readonly id: string, readonly balance: number) {
		this.id = id;
		this.balance = balance;
	}

	getId(): string {
		return this.id;
	}

	getBalance(): number {
		return this.balance;
	}
}