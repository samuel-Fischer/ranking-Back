import { Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { StatusService } from './status.service';

@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Post()
  create() {
    return 'This action adds a new status';
  }

  @Get()
  findAll() {
    return this.statusService.findAll();
  }

  @Get('position/:id')
  async getUserPosition(@Param('id', ParseIntPipe) userId: number) {
    return this.statusService.getUserRankingPosition(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.statusService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return `This action updates a #${id} status`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} status`;
  }
}
