import { ReviewEntity } from '@app/db/lesson-material/review.entity';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Min,
    Max,
} from 'class-validator';
import { FilterOperator, PaginateConfig } from 'nestjs-paginate';

export class CreateReviewDto {
    @IsInt()
    @IsNotEmpty()
    @ApiProperty()
    instructorId: number;

    @IsInt()
    @IsNotEmpty()
    @ApiProperty()
    studentId: number;

    @IsInt()
    @IsNotEmpty()
    @ApiProperty()
    scheduleId: number;

    @IsInt()
    @Min(1)
    @Max(5)
    @IsOptional()
    @ApiProperty()
    rating: number = 5;

    @IsString()
    @IsOptional()
    @ApiProperty()
    review?: string;
}

export class UpdateReviewDto extends PartialType(CreateReviewDto) { }


export const reviewPageConfig: PaginateConfig<ReviewEntity> = {
    sortableColumns: ['id'],
    defaultSortBy: [['id', 'DESC']],
    searchableColumns: ['instructor.userProfile.firstName', 'student.userProfile.firstName'],
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
        'rating',
        'review',
        'createdAt',
        'updatedAt',
    ],
    filterableColumns: {
        'instructor.userProfile.firstName': [FilterOperator.ILIKE],
        'student.userProfile.firstName': [FilterOperator.ILIKE],
    },
    relations: ['instructor', 'student', 'instructor.userProfile', 'student.userProfile'],
};
