import { ApiProperty } from "@nestjs/swagger";

export class FindResponseDto {
	@ApiProperty({ example: 100 })
	balance: number;
}

export class FindExtractResponseDto {
	@ApiProperty({ example: 'Pedro Azevedo' })
	customer: string | null;
	@ApiProperty({ example: 10 })
	amount: number;
	@ApiProperty({ example: '2024-05-01T00:00:00.000Z' })
	date: Date;

	// TODO: add transaction type
	@ApiProperty({ example: 'deposit' })
	type: string;
}