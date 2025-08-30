import { NotificationEntity } from "@app/db";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsString, IsOptional } from "class-validator";
import { FilterOperator, PaginateConfig } from "nestjs-paginate";

export class CreateNotificationDto {
    @IsNumber()
    @Type(() => Number)
    @ApiProperty()
    @IsOptional()
    userId?: number;

    @IsString()
    @IsOptional()
    @ApiProperty()
    title?: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    description?: string;
}

export const notificationPageConfig: PaginateConfig<NotificationEntity> = {
    sortableColumns: ['id', 'title'],
    defaultSortBy: [['id', 'DESC']],
    searchableColumns: ['title', 'description'],
    select: ['id', 'title', 'description', 'user.id', 'user.userProfile.id', 'user.userProfile.firstName', 'user.userProfile.lastName', 'createdAt', 'updatedAt'],
    filterableColumns: {
        name: [FilterOperator.ILIKE],
        'user.id': [FilterOperator.EQ],
    },
    relations: ['user', 'user.userProfile'],
};
