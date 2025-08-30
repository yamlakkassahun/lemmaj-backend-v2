import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
} from '@nestjs/common';
import { LeaveService } from '../services';
import { LeaveEntity } from '@app/db';
import {
    ApiOkPaginatedResponse,
    ApiPaginationQuery,
    Paginate,
    Paginated,
    PaginateQuery,
} from 'nestjs-paginate';
import { ApiTags, ApiCookieAuth } from '@nestjs/swagger';
import { CreateLeaveDto, leavePageConfig, UpdateLeaveDto } from '../dtos';

@ApiTags('Parameters')
@ApiCookieAuth()
@Controller('instractor-leave')
export class LeaveController {
    constructor(private readonly leaveService: LeaveService) { }

    @Post()
    create(@Body() dto: CreateLeaveDto) {
        return this.leaveService.create(dto);
    }

    @Get()
    @ApiOkPaginatedResponse(LeaveEntity, leavePageConfig)
    @ApiPaginationQuery(leavePageConfig)
    findAll(@Paginate() query: PaginateQuery): Promise<Paginated<LeaveEntity>> {
        return this.leaveService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.leaveService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateLeaveDto) {
        return this.leaveService.update(+id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.leaveService.remove(+id);
    }
}
