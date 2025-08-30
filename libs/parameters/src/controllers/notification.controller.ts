import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
} from '@nestjs/common';
import { LeaveService, NotificationService } from '../services';
import { LeaveEntity, NotificationEntity } from '@app/db';
import {
    ApiOkPaginatedResponse,
    ApiPaginationQuery,
    Paginate,
    Paginated,
    PaginateQuery,
} from 'nestjs-paginate';
import { ApiTags, ApiCookieAuth } from '@nestjs/swagger';
import { CreateLeaveDto, leavePageConfig, notificationPageConfig, UpdateLeaveDto } from '../dtos';

@ApiTags('Notifications')
@ApiCookieAuth()
@Controller('notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Get()
    @ApiOkPaginatedResponse(NotificationEntity, notificationPageConfig)
    @ApiPaginationQuery(notificationPageConfig)
    findAll(@Paginate() query: PaginateQuery): Promise<Paginated<NotificationEntity>> {
        return this.notificationService.findAll(query);
    }
}