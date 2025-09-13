import { LeaveEntity } from '@app/db';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsUUID, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { PaginateConfig, FilterOperator } from 'nestjs-paginate';

export class CreateLeaveDto {
    @IsNumber()
    @Type(() => Number)
    @ApiProperty()
    instructorId: number;

    @IsNumber()
    @Type(() => Number)
    @ApiProperty()
    dutyDateId: number;

    @IsNumber()
    @Type(() => Number)
    @ApiProperty()
    lessonId: number;

    @IsNumber()
    @Type(() => Number)
    @ApiProperty()
    studentId: number;

    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty()
    isApproved: boolean;

    @IsString()
    @IsOptional()
    @ApiProperty()
    reason?: string;
}

export class UpdateLeaveDto extends PartialType(CreateLeaveDto) { }

export const leavePageConfig: PaginateConfig<LeaveEntity> = {
    sortableColumns: ['id'],
    defaultSortBy: [['id', 'DESC']],
    searchableColumns: ['instructor.userProfile.firstName',],
    select: [
        'id',
        'instructor.id',
        'instructor.userProfile.id',
        'instructor.userProfile.firstName',
        'instructor.userProfile.lastName',
        'student.id',
        'student.userProfile.id',
        'student.userProfile.firstName',
        'student.userProfile.lastName',
        'lesson.id',
        'lesson.status',
        'lesson.package.id',
        'lesson.package.name',
        'dutyDate.id',
        'dutyDate.date',
        'isApproved',
        'reason',
        'createdAt',
        'updatedAt'
    ],
    filterableColumns: {
        'instructor.id': [FilterOperator.EQ],
        'instructor.userProfile.firstName': [FilterOperator.ILIKE],
        'dutyDate.date': [FilterOperator.BTW],
    },
    relations: ['instructor', 'instructor.userProfile', 'student', 'student.userProfile', 'dutyDate', 'lesson', 'lesson.package'],
};
