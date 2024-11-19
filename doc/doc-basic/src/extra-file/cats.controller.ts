import { Controller, Get, Query, Post, Body, Put, Param, Delete } from '@nestjs/common';
// import { CreateCatDto, UpdateCatDto, ListAllEntities } from './dto';

@Controller('extera/cats')
export class CatsController {
    @Post()
    create(@Body() body: any ) {
        return 'This action adds a new cat';
    }

    @Get()
    findAll(@Query() query: any) {
        return `This action returns all cats (limit: items)`;
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return `This action returns a #${id} cat`;
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() body: any ) {
        return `This action updates a #${id} cat`;
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return `This action removes a #${id} cat`;
    }
}
