import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
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

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body('name') name: string) {
    return this.gamesService.create(name);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body('name') name: string) {
    return this.gamesService.update(id, name);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.gamesService.remove(id);
  }
}
