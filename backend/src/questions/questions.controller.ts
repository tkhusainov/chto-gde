import { Controller, Get, Post, Patch, Delete, Query, Param, Body, UseGuards } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get('public')
  findPublic(@Query('gameId') gameId: string, @Query('pin') pin: string) {
    return this.questionsService.findPublic(gameId, pin);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('gameId') gameId?: string) {
    return this.questionsService.findAll(gameId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: Record<string, any>) {
    const { gameId, ...data } = body;
    return this.questionsService.create(gameId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Record<string, any>) {
    return this.questionsService.update(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionsService.remove(id);
  }
}
