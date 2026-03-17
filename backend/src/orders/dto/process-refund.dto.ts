import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class ProcessRefundDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsOptional()
  @IsString()
  reason?: string;
}
