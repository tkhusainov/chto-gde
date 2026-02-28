import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Question, QuestionDocument } from './schemas/question.schema';
import { GamesService } from '../games/games.service';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
    private readonly gamesService: GamesService,
  ) {}

  async findAll(gameId?: string): Promise<QuestionDocument[]> {
    const filter: any = {};
    if (gameId) {
      filter.gameId = new Types.ObjectId(gameId);
    }
    return this.questionModel.find(filter).exec();
  }

  async create(gameId: string, data: Record<string, any>): Promise<QuestionDocument> {
    const { gameId: _, ...fields } = data;
    return new this.questionModel({ ...fields, gameId: new Types.ObjectId(gameId) }).save();
  }

  async update(mongoId: string, data: Record<string, any>): Promise<QuestionDocument> {
    const q = await this.questionModel.findByIdAndUpdate(mongoId, { $set: data }, { new: true }).exec();
    if (!q) throw new NotFoundException('Question not found');
    return q;
  }

  async remove(mongoId: string): Promise<void> {
    const result = await this.questionModel.findByIdAndDelete(mongoId).exec();
    if (!result) throw new NotFoundException('Question not found');
  }

  async findPublic(gameId: string, pin: string): Promise<QuestionDocument[]> {
    // join validates code+pin; here we validate by gameId+pin
    const game = await this.gamesService.findById(gameId);
    if (game.pin !== pin) {
      throw new UnauthorizedException('Неверный PIN');
    }
    return this.questionModel.find({ gameId: new Types.ObjectId(gameId) }).exec();
  }
}
