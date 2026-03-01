import { Injectable, NotFoundException, UnauthorizedException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Question, QuestionDocument } from './schemas/question.schema';
import { GamesService } from '../games/games.service';
import { UserRole } from '../users/schemas/user.schema';
import { MAX_QUESTIONS_PER_GAME } from '../config/constants';

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

  private async checkGameOwnership(gameId: string, requestingUserId: string): Promise<void> {
    const game = await this.gamesService.findById(gameId);
    if (game.userId?.toString() !== requestingUserId) {
      throw new ForbiddenException('Access denied');
    }
  }

  async create(gameId: string, data: Record<string, any>, requestingUserId: string, requestingUserRole: UserRole): Promise<QuestionDocument> {
    if (requestingUserRole !== UserRole.Admin) {
      await this.checkGameOwnership(gameId, requestingUserId);
    }
    const count = await this.questionModel.countDocuments({ gameId: new Types.ObjectId(gameId) });
    if (count >= MAX_QUESTIONS_PER_GAME) {
      throw new BadRequestException(`Максимум ${MAX_QUESTIONS_PER_GAME} вопросов в игре`);
    }
    const { gameId: _, ...fields } = data;
    return new this.questionModel({ ...fields, gameId: new Types.ObjectId(gameId) }).save();
  }

  async update(mongoId: string, data: Record<string, any>, requestingUserId: string, requestingUserRole: UserRole): Promise<QuestionDocument> {
    if (requestingUserRole !== UserRole.Admin) {
      const question = await this.questionModel.findById(mongoId).select('gameId').exec();
      if (!question) throw new NotFoundException('Question not found');
      await this.checkGameOwnership(question.gameId!.toString(), requestingUserId);
    }
    const q = await this.questionModel.findByIdAndUpdate(mongoId, { $set: data }, { new: true }).exec();
    if (!q) throw new NotFoundException('Question not found');
    return q;
  }

  async remove(mongoId: string, requestingUserId: string, requestingUserRole: UserRole): Promise<void> {
    if (requestingUserRole !== UserRole.Admin) {
      const question = await this.questionModel.findById(mongoId).select('gameId').exec();
      if (!question) throw new NotFoundException('Question not found');
      await this.checkGameOwnership(question.gameId!.toString(), requestingUserId);
    }
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
