import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './entities';
import { CreateUserDto, UpdateUserDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const hash = await argon.hash(dto.password);

    const user = this.userRepository.create({
      email: dto.email,
      name: dto.name,
      hash,
    });

    const savedUser = await this.userRepository.save(user);

    delete savedUser.hash;
    delete savedUser.refresh_tokens;

    return savedUser;
  }

  async update(id: number, dto: UpdateUserDto) {
    const hash = await argon.hash(dto.password);

    await this.userRepository.update(id, {
      name: dto.name,
      email: dto.email,
      hash,
    });

    const user = await this.userRepository.findOneBy({ id });

    delete user.hash;
    delete user.refresh_tokens;

    return user;
  }

  async delete(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException('User not found');

    await this.userRepository.delete(id);

    return { message: 'User deleted' };
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    delete user.hash;
    delete user.refresh_tokens;

    return user;
  }

  async findOneBy(options: FindOptionsWhere<User>) {
    const user = await this.userRepository.findOneBy(options);

    return user;
  }

  async removeRefreshToken(id: number, refresh_token: string) {
    const updatedUser = await this.userRepository.update(
      { id },
      {
        refresh_tokens: () =>
          `array_remove("refresh_tokens", '${refresh_token}')`,
      },
    );

    return updatedUser;
  }

  async updateRefreshTokens(id: number, tokens: string[]) {
    const updatedUser = await this.userRepository.update(
      { id },
      { refresh_tokens: tokens },
    );

    return updatedUser;
  }

  async addRefreshToken(id: number, refresh_token: string) {
    const updatedUser = this.userRepository.update(
      { id },
      {
        refresh_tokens: () =>
          `array_append("refresh_tokens", '${refresh_token}')`,
      },
    );

    return updatedUser;
  }
}
