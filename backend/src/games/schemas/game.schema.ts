import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GameDocument = HydratedDocument<Game>;

@Schema({ timestamps: true })
export class Game {
  @Prop({ required: true, unique: true })
  name: string;
}

export const GameSchema = SchemaFactory.createForClass(Game);
