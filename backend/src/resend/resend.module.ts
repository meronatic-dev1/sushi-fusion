import { Module } from '@nestjs/common';
import { ResendService } from './resend.service';
import { DailySummaryService } from './daily-summary.service';
import { BullModule } from '@nestjs/bullmq';
import { EmailProcessor } from './email.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'emails',
    }),
  ],
  providers: [ResendService, DailySummaryService, EmailProcessor],
  exports: [ResendService],
})
export class ResendModule { }
