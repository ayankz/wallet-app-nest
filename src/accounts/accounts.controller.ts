import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { GetCurrentUserId } from 'src/common/decorators';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';


@ApiTags('accounts')
@ApiBearerAuth()
@Controller('accounts')
export class AccountsController {
    constructor(
        private accountService: AccountsService,
    ) { }
    @Get()
    getAccounts(@GetCurrentUserId() userId: number) {
    }

    @Post()
    createAccount(@GetCurrentUserId() userId: number, @Body() dto: CreateAccountDto) {
    }

    @Patch(':accountId')
    updateAccount(@Param('accountId') accountId: string, @GetCurrentUserId() userId: number, @Body() dto: UpdateAccountDto) {
    }

    @Delete(':accountId')
    deleteAccount(@Param('accountId') accountId: string, @GetCurrentUserId() userId: number) {
    }
}
