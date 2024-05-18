export class WalletEntity {

	private id?: string;
	private balance: number;

	constructor(balance: number, id?: string) {
		this.id = id;
		this.balance = balance;
	}

	getId(): string {
		return this.id;
	}

	setId(id: string): void {
		this.id = id;
	}

	getBalance(): number {
		return this.balance;
	}

	setBalance(balance: number): void {
		this.balance = balance;
	}
}