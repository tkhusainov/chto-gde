import { Injectable, ConflictException, NotFoundException, OnModuleInit, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, UserRole } from './schemas/user.schema';
import { GamesService } from '../games/games.service';
import { ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD, MAX_USERS } from '../config/constants';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly gamesService: GamesService,
  ) {}

  async onModuleInit() {
    const exists = await this.userModel.exists({ email: ADMIN_EMAIL }).exec();
    if (!exists) {
      await this.create(ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, UserRole.Admin);
      this.logger.log(`Admin user created: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
    }
  }

  async create(name: string, email: string, password: string, role?: UserRole) {
    const existing = await this.userModel.findOne({ email }).exec();
    if (existing) {
      throw new ConflictException('Email already taken');
    }
    const count = await this.userModel.countDocuments();
    if (count >= MAX_USERS) {
      throw new BadRequestException(`Максимум ${MAX_USERS} пользователей`);
    }
    const hash = await bcrypt.hash(password, 12);
    const user = new this.userModel({ name, email, password: hash, role: role || UserRole.Editor });
    const saved = await user.save();
    return { id: saved._id, name: saved.name, email: saved.email, role: saved.role };
  }

  async findAll() {
    const users = await this.userModel.find().select('-password').exec();
    return users.map(u => ({ id: u._id, name: u.name, email: u.email, role: u.role }));
  }

  async update(id: string, data: { name?: string; email?: string; role?: UserRole }) {
    const user = await this.userModel
      .findByIdAndUpdate(id, data, { new: true })
      .select('-password')
      .exec();
    if (!user) throw new NotFoundException('User not found');
    return { id: user._id, name: user.name, email: user.email, role: user.role };
  }

  async remove(id: string) {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) throw new NotFoundException('User not found');
    await this.gamesService.removeByUserId(id);
    return { success: true };
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }
}
