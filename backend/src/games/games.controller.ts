import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { GamesService } from './games.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post('join')
  join(@Body('code') code: string, @Body('pin') pin: string) {
    return this.gamesService.join(code, pin);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.gamesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.gamesService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body('name') name: string, @Request() req: any) {
    return this.gamesService.create(name, req.user?._id?.toString());
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body('name') name: string, @Request() req: any) {
    return this.gamesService.update(id, name, req.user._id.toString(), req.user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req: any) {
    return this.gamesService.remove(id, req.user._id.toString(), req.user.role);
  }
}
