import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user/user.entity';
import { compare, hash } from 'bcryptjs';
import { userInput, userUpdateInput } from 'src/entities/user/user.input';
import { login } from './users.types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async getUsers(): Promise<User[]> {
    try {
      return this.usersRepository.find();
    } catch (err) {
      throw new HttpException('finding users failed', 500);
    }
  }

  async create(userInput: userInput): Promise<any | Error> {
    const { email } = userInput;
    const emailExists = await this.findByEmail(email);
    if (emailExists) {
      throw new HttpException(`Email address has been already taken`, 500);
    }
    const newUser = await this.usersRepository.save({
      ...userInput,
      password: await hash(userInput.password, 10),
    });

    return {
      id: newUser.id,
      email: newUser.email,
    };
  }

  async updateUser(id: number, input: userUpdateInput): Promise<User> {
    try {
      if (input.password) {
        input.password = await hash(input.password, 10);
      }
      await this.usersRepository.update(id, { ...input });
      return this.usersRepository.findOne({
        select: ['id', 'email'],
        where: { id },
      });
    } catch (err) {
      throw new HttpException('updating user failed', 500);
    }
  }

  async deleteUser(id: number): Promise<number> {
    try {
      return (await this.usersRepository.delete(id)).affected;
    } catch (err) {
      throw new HttpException('deleting user failed', 500);
    }
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async login(login: login) {
    const { email, password } = login;

    const user = await this.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    const isValid = await compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Incorrect email address or password');
    }
    return user;
  }

  async findById(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }
}
