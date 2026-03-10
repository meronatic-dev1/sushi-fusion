import { Module } from '@nestjs/common';
import { ResendService } from './resend.service';
import { DailySummaryService } from './daily-summary.service';

@Module({
  providers: [ResendService, DailySummaryService],
  exports: [ResendService],
})
export class ResendModule { }
