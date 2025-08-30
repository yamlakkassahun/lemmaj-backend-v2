import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Put,
    Delete,
} from '@nestjs/common';
import { ReviewService } from '../services';
import { ReviewEntity, UserEntity } from '@app/db';
import {
    ApiOkPaginatedResponse,
    ApiPaginationQuery,
    Paginate,
    PaginateQuery,
    Paginated,
} from 'nestjs-paginate';
import { CreateReviewDto, reviewPageConfig, UpdateReviewDto } from '../dtos';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Lesson-Material')
@Controller('reviews')
@ApiCookieAuth()
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) { }

    @Get()
    @ApiOkPaginatedResponse(UserEntity, reviewPageConfig)
    @ApiPaginationQuery(reviewPageConfig)
    findAll(@Paginate() query: PaginateQuery): Promise<Paginated<ReviewEntity>> {
        return this.reviewService.findAll(query);
    }

    @Get(':id')
    async getOne(@Param('id') id: number) {
        return this.reviewService.findOne(id);
    }

    @Post()
    create(@Body() dto: CreateReviewDto) {
        return this.reviewService.create(dto);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() dto: UpdateReviewDto) {
        return this.reviewService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.reviewService.remove(id);
    }
}
