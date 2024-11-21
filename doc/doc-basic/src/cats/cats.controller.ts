// import {Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Header, Redirect, Query} from '@nestjs/common';
// import { CatsService } from './cats.service';
// import { CreateCatDto } from './dto/create-cat.dto';
// import { UpdateCatDto } from './dto/update-cat.dto';
//
// @Controller('cats')
// export class CatsController {
//   constructor(private readonly catsService: CatsService) {}
//
//   @Post()
//   create(@Body() createCatDto: CreateCatDto) {
//     console.log(createCatDto.name);
//     return this.catsService.create(createCatDto);
//   }
//
//   @Get()
//   findAll() {
//     return this.catsService.findAll();
//   }
//
//   @Get(':id')
//   findOne(@Param('id') id: number) {
//     console.log(typeof id === 'number');
//     return this.catsService.findOne(+id);
//   }
//
//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
//     return this.catsService.update(+id, updateCatDto);
//   }
//
//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.catsService.remove(+id);
//   }
// }

// -------------------------


import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
