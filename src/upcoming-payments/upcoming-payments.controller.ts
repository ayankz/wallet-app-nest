import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId } from 'src/common/decorators';
import { CreateUpcomingPaymentDto } from './dto/create-upcoming-payments.dto/create-upcoming-payments.dto';
import { UpcomingPaymentsService } from './upcoming-payments.service';

@ApiTags('upcoming-payments')
@ApiBearerAuth()
@Controller('upcoming-payments')
export class UpcomingPaymentsController {
  constructor(
    private readonly upcomingPaymentsService: UpcomingPaymentsService,
  ) {}

  @Get()
  getUpcomingPayments(@GetCurrentUserId() userId: number) {
    return this.upcomingPaymentsService.getUpcomingPayments(userId);
  }

  @Post()
  createUpcomingPayment(
    @GetCurrentUserId() userId: number,
    @Body() dto: CreateUpcomingPaymentDto,
  ) {
    return this.upcomingPaymentsService.createUpcomingPayment(userId, dto);
  }
}
