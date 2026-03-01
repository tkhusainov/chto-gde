import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { QuestionType } from '../enums/question-type.enum';
import { AnswerType } from '../enums/answer-type.enum';

export type QuestionDocument = HydratedDocument<Question>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      ret.id = ret._id?.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Question {
  @Prop({ required: true, enum: QuestionType })
  type: QuestionType;

  @Prop({ type: Types.ObjectId, ref: 'Game', index: true })
  gameId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', index: true })
  userId?: Types.ObjectId;

  @Prop()
  image?: string;

  @Prop()
  video?: string;

  @Prop()
  header?: string;

  @Prop()
  description?: string;

  @Prop({ type: Object })
  answer?: {
    type: AnswerType;
    description?: string;
    image?: string;
    video?: string;
  };

  @Prop({ type: Object })
  author?: {
    name: string;
    photo: string;
  };

  @Prop({ type: [Object], default: undefined })
  subQuestions?: Array<{
    type: string;
    image?: string;
    video?: string;
    header?: string;
    description?: string;
    answer?: {
      type: AnswerType;
      description?: string;
      image?: string;
      video?: string;
    };
  }>;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
