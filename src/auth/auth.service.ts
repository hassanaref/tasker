import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entities';
import { UsersService } from '../controllers/users/users.service';
import { IAuthPayload } from './auth.interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtTokenService: JwtService,
  ) {}
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (await bcrypt.compare(password, user.password)) {
      delete user.password;
      return user;
    }
    return null;
  }

  async generateUserCredentials(user: User) {
    const payload: IAuthPayload = {
      email: user.email,
      id: user.id,
    };
    console.log('here');
    try {
      let access_token = this.jwtTokenService.sign(payload);
      return {
        access_token,
      };
    } catch (err) {
      console.log(err);
    }
  }
}
