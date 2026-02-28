import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GameDocument = HydratedDocument<Game>;

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
export class Game {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true, length: 4 })
  code: string;

  @Prop({ required: true, length: 4 })
  pin: string;
}

export const GameSchema = SchemaFactory.createForClass(Game);
