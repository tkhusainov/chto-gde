import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { QuestionType } from '../enums/question-type.enum';

export type QuestionDocument = HydratedDocument<Question>;

@Schema({ timestamps: true })
export class Question {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true, enum: QuestionType })
  type: QuestionType;

  @Prop({ type: Types.ObjectId, ref: 'Game', index: true })
  gameId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', index: true })
  userId?: Types.ObjectId;

  @Prop()
  srcPath?: string;

  @Prop()
  header?: string;

  @Prop()
  description?: string;

  @Prop({ type: Object })
  answer?: {
    type: string;
    description?: string;
    srcPath?: string;
  };

  @Prop({ type: Object })
  author?: {
    name: string;
    photo: string;
  };

  @Prop({ type: [Object], default: undefined })
  subQuestions?: Array<{
    id: string;
    type: string;
    srcPath?: string;
    header?: string;
    description?: string;
    answer?: {
      type: string;
      description?: string;
      srcPath?: string;
    };
  }>;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
QuestionSchema.index({ id: 1, gameId: 1 }, { unique: true });
