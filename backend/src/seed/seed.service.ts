import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game, GameDocument } from '../games/schemas/game.schema';
import { Question, QuestionDocument } from '../questions/schemas/question.schema';
import { games as gamesData } from './data/games.seed';
import { questions as questions0 } from './data/questions-0.seed';
import { questions as questions1 } from './data/questions-1.seed';
import { questions as questions2 } from './data/questions-2.seed';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(Game.name) private gameModel: Model<GameDocument>,
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    this.logger.log('Seeding database...');

    await this.questionModel.deleteMany({});
    await this.gameModel.deleteMany({});
    this.logger.log('Cleared existing data');

    const createdGames = await this.gameModel.insertMany(gamesData);
    const [game0, game1, game2] = createdGames;
    this.logger.log(`Created ${createdGames.length} games`);

    const allQuestionSets = [
      { gameId: game0._id, questions: questions0 },
      { gameId: game1._id, questions: questions1 },
      { gameId: game2._id, questions: questions2 },
    ];

    for (const { gameId, questions } of allQuestionSets) {
      const docs = questions.map((q) => ({ ...q, gameId }));
      try {
        await this.questionModel.insertMany(docs, { ordered: false });
      } catch (err: any) {
        if (err.code === 11000 || err.name === 'MongoBulkWriteError') {
          this.logger.warn(`Skipped duplicate questions for game ${gameId}`);
        } else {
          throw err;
        }
      }
    }

    this.logger.log('Seed complete');
  }
}
