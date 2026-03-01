import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedService } from './seed.service';
import { Game, GameSchema } from '../games';
import { Question, QuestionSchema } from '../questions';
import { User, UserSchema } from '../users/schemas/user.schema';
import configuration from '../config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Game.name, schema: GameSchema },
      { name: Question.name, schema: QuestionSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
