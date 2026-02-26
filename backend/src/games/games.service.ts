import { Injectable } from '@nestjs/common';
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
}
