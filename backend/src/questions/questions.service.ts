import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Question, QuestionDocument } from './schemas/question.schema';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
  ) {}

  async findAll(gameId?: string): Promise<QuestionDocument[]> {
    const filter: any = {};
    if (gameId) {
      filter.gameId = new Types.ObjectId(gameId);
    }
    return this.questionModel.find(filter).exec();
  }
}
