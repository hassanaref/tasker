import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../../entities/user/user.entity';
import { login, loginResponse } from './users.types';
import { AuthService } from '../../auth/auth.service';
import { LoggingInterceptor } from '../../utils/logging.interceptor';
import { JWTRestAuthGuard } from 'src/auth/auth.guard';
import { userInput, userUpdateInput } from 'src/entities/user/user.input';
import { IAuthDetail } from 'src/auth/auth.interfaces';
import { RestAuthDetail } from 'src/decorators/authentication.decorator';

@UseInterceptors(LoggingInterceptor)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JWTRestAuthGuard)
  @Get()
  getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }

  @Post('/create')
  createUser(@Body() user: userInput) {
    return this.usersService.create(user);
  }

  @UseGuards(JWTRestAuthGuard)
  @Put('/update')
  updateUser(
    @RestAuthDetail() user: IAuthDetail,
    @Body() input: userUpdateInput,
  ): Promise<User> {
    return this.usersService.updateUser(user.currentUser.id, input);
  }

  @UseGuards(JWTRestAuthGuard)
  @Delete('/delete')
  deleteUser(@RestAuthDetail() user: IAuthDetail): Promise<number> {
    return this.usersService.deleteUser(user.currentUser.id);
  }

  @Post('/login')
  async login(@Body() login: login): Promise<loginResponse> {
    const user = await this.usersService.login(login);
    const token = await this.authService.generateUserCredentials(user);
    return {
      id: user.id,
      email: user.email,
      jwtToken: token?.access_token,
    };
  }
}
