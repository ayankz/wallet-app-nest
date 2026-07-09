import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TransferService } from './transfer.service';
import { GetCurrentUserId } from 'src/common/decorators';
import { CreateTransferDto } from './dto/create-transfer.dto';

@Controller('transfers')
@ApiTags('transfers')
@ApiBearerAuth()
export class TransferController {
    constructor(private transferService: TransferService) { }
    @Post()
    createTransfer(
        @GetCurrentUserId() userId: number,
        @Body() dto: CreateTransferDto,
    ) {
        return this.transferService.createTransfer(userId, dto);
    }
}

