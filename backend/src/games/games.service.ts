import { Injectable, NotFoundException, UnauthorizedException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Game, GameDocument } from './schemas/game.schema';
import { Question, QuestionDocument } from '../questions/schemas/question.schema';
import { UserRole } from '../users/schemas/user.schema';
import { MAX_GAMES_PER_USER } from '../config/constants';

@Injectable()
export class GamesService {
  constructor(
    @InjectModel(Game.name) private gameModel: Model<GameDocument>,
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
  ) {}

  async findAll(): Promise<GameDocument[]> {
    return this.gameModel.find().exec();
  }

  private rand4(): string {
    return String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  }

  private async generateUniqueCode(): Promise<string> {
    for (let i = 0; i < 100; i++) {
      const code = this.rand4();
      const exists = await this.gameModel.exists({ code });
      if (!exists) return code;
    }
    throw new Error('Failed to generate unique code');
  }

  async create(name: string, userId?: string): Promise<GameDocument> {
    if (userId) {
      const count = await this.gameModel.countDocuments({ userId: new Types.ObjectId(userId) });
      if (count >= MAX_GAMES_PER_USER) {
        throw new BadRequestException(`Максимум ${MAX_GAMES_PER_USER} игр на пользователя`);
      }
    }
    const code = await this.generateUniqueCode();
    const pin = this.rand4();
    const data: any = { name, code, pin };
    if (userId) data.userId = new Types.ObjectId(userId);
    return new this.gameModel(data).save();
  }

  async update(id: string, name: string, requestingUserId: string, requestingUserRole: UserRole): Promise<GameDocument> {
    const game = await this.gameModel.findById(id).exec();
    if (!game) throw new NotFoundException('Game not found');
    if (requestingUserRole !== UserRole.Admin && game.userId?.toString() !== requestingUserId) {
      throw new ForbiddenException('Access denied');
    }
    return this.gameModel.findByIdAndUpdate(id, { name }, { new: true }).exec();
  }

  async findById(id: string): Promise<GameDocument> {
    const game = await this.gameModel.findById(id).exec();
    if (!game) throw new NotFoundException('Game not found');
    return game;
  }

  async join(code: string, pin: string): Promise<{ id: string; name: string; code: string }> {
    const game = await this.gameModel.findOne({ code }).exec();
    if (!game) throw new NotFoundException('Игра не найдена');
    if (game.pin !== pin) throw new UnauthorizedException('Неверный PIN');
    return { id: String(game._id), name: game.name, code: game.code };
  }

  async remove(id: string, requestingUserId: string, requestingUserRole: UserRole): Promise<void> {
    const game = await this.gameModel.findById(id).exec();
    if (!game) throw new NotFoundException('Game not found');
    if (requestingUserRole !== UserRole.Admin && game.userId?.toString() !== requestingUserId) {
      throw new ForbiddenException('Access denied');
    }
    await game.deleteOne();
    await this.questionModel.deleteMany({ gameId: new Types.ObjectId(id) }).exec();
  }

  async removeByUserId(userId: string): Promise<void> {
    const games = await this.gameModel.find({ userId: new Types.ObjectId(userId) }).select('_id').exec();
    const gameIds = games.map(g => g._id);
    if (gameIds.length === 0) return;
    await this.questionModel.deleteMany({ gameId: { $in: gameIds } }).exec();
    await this.gameModel.deleteMany({ _id: { $in: gameIds } }).exec();
  }
}
