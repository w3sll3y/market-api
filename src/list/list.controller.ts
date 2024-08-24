import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) { }

  @Post()
  create(@Body() createListDto: CreateListDto, @CurrentUser() user: User) {
    return this.listService.create(createListDto, user.id);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.listService.findAll(user.id);
  }

  @Get('/open')
  findOpenOne(@CurrentUser() user: User) {
    return this.listService.findOpenOne(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.listService.findOne(id, user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateListDto: UpdateListDto, @CurrentUser() user: User) {
    return this.listService.update(id, updateListDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.listService.remove(id, user.id);
  }
}
