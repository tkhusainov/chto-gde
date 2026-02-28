import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game, GameDocument } from './schemas/game.schema';

@Injectable()
export class GamesService {
  constructor(@InjectModel(Game.name) private gameModel: Model<GameDocument>) {}

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

  async create(name: string): Promise<GameDocument> {
    const code = await this.generateUniqueCode();
    const pin = this.rand4();
    return new this.gameModel({ name, code, pin }).save();
  }

  async update(id: string, name: string): Promise<GameDocument> {
    const game = await this.gameModel.findByIdAndUpdate(id, { name }, { new: true }).exec();
    if (!game) throw new NotFoundException('Game not found');
    return game;
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

  async remove(id: string): Promise<void> {
    const result = await this.gameModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Game not found');
  }
}
