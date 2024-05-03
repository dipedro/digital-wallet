import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsUUID, ValidateIf } from "class-validator";
import { OperationType } from "./enums";

export class FindResponseDto {
	@ApiProperty({ example: 100 })
	balance: number;
}

export class FindExtractResponseDto {
	@ApiProperty({ example: 'Pedro Azevedo' })
	customer?: string | null;

	@ApiProperty({ example: 10 })
	amount: number;

	@ApiProperty({ example: '2024-05-01T00:00:00.000Z' })
	date: Date;

	@ApiProperty({ example: 'deposit' })
	operationType: OperationType;
}

export class MakeTransactionRequestDto {
	@ApiProperty({ example: 'deposit, withdraw, purchase, chargeback, cancellation' })
	@IsEnum(OperationType)
	operationType: OperationType;

	@ApiProperty({ example: '123' })
	@IsUUID()
	@IsOptional()
	@ValidateIf((o) => [OperationType.CANCELLATION , OperationType.CHARGEBACK].includes(o.operationType))
	transactionId?: string | null;

	@ApiProperty({ example: 100 })
	@IsOptional()
	@ValidateIf((o) => ![OperationType.CANCELLATION , OperationType.CHARGEBACK].includes(o.operationType))
	amount?: number | null;
}