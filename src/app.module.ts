import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { typeOrmConfigAsync } from '../typeorm.config';
import { TaskModule, UserModule } from './modules';
import { ConfigModule } from '@nestjs/config';

import { TasksService, UsersService } from './controllers';
import { Task } from './entities/task/task.entity';
import { User } from './entities';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth.module';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync as TypeOrmModuleOptions),
    TypeOrmModule.forFeature([User, Task]),
    UserModule,
    TaskModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, UsersService, TasksService, AuthService, JwtService],
})
export class AppModule {}
