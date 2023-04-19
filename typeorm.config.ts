import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { Task, User } from 'src/entities';


import { LoggerOptions } from 'typeorm';

export default class TypeOrmConfig {
  static getOrmConfig(configService: ConfigService){
    return {
      type: 'postgres',
      host: configService.get('DB_HOST') || 'localhost',
      port: configService.get('DB_PORT') || 5432,
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_DATABASE'),
      entities: [Task,User],
      synchronize: configService.get<boolean>('DB_SYNCHRONIZE') || false,
      logging: configService.get<LoggerOptions>('DB_LOGGING') || false,
      migrations: ['dist/src/typeorm/migrations/**/*.js'],
      subscribers: ['src/typeorm/subscriber/**/*.ts'],
      cli: {
        entitiesDir: 'src/entities',
        migrationsDir: 'src/typeorm/migrations',
        subscribersDir: 'src/typeorm/subscriber',
      },
    };
  }
}

export const typeOrmConfigAsync = {
  imports: [ConfigModule],
  useFactory: async (
    configService: ConfigService,
  ) => TypeOrmConfig.getOrmConfig(configService),
  inject: [ConfigService],
};
