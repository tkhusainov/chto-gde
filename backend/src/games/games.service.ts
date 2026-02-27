import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game, GameDocument } from './schemas/game.schema';

@Injectable()
export class GamesService {
  constructor(@InjectModel(Game.name) private gameModel: Model<GameDocument>) {}

  async findAll(): Promise<GameDocument[]> {
    return this.gameModel.find().exec();
  }

  async create(name: string): Promise<GameDocument> {
    return new this.gameModel({ name }).save();
  }

  async update(id: string, name: string): Promise<GameDocument> {
    const game = await this.gameModel.findByIdAndUpdate(id, { name }, { new: true }).exec();
    if (!game) throw new NotFoundException('Game not found');
    return game;
  }

  async remove(id: string): Promise<void> {
    const result = await this.gameModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Game not found');
  }
}
