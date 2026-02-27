import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedService } from './seed.service';
import { Game, GameSchema } from '../games';
import { Question, QuestionSchema } from '../questions';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Game.name, schema: GameSchema },
      { name: Question.name, schema: QuestionSchema },
    ]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
