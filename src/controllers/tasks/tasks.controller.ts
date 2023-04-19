import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from '../../entities/task/task.entity';
import { JWTRestAuthGuard } from 'src/auth/auth.guard';
import { RestAuthDetail } from 'src/decorators/authentication.decorator';
import { IAuthDetail } from 'src/auth/auth.interfaces';
import { LoggingInterceptor } from 'src/utils/logging.interceptor';
import { taskInput, taskUpdateInput } from 'src/entities/task/task.input';

@UseInterceptors(LoggingInterceptor)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(JWTRestAuthGuard)
  @Get()
  getTasks(
    @Query('page') page: number,
    @RestAuthDetail() user: IAuthDetail,
  ): Promise<Task[]> {
    return this.tasksService.getTasks(user.currentUser.id, page);
  }

  @UseGuards(JWTRestAuthGuard)
  @Post('/create')
  createTask(
    @RestAuthDetail() user: IAuthDetail,
    @Body() task: taskInput,
  ): Promise<Task> {
    return this.tasksService.createTask(task, user.currentUser.id);
  }

  @UseGuards(JWTRestAuthGuard)
  @Put('/update')
  updateTask(@Body() task: taskUpdateInput): Promise<Task> {
    return this.tasksService.updateTask(task);
  }

  @UseGuards(JWTRestAuthGuard)
  @Delete('/delete/:id')
  deleteTask(
    @RestAuthDetail() user: IAuthDetail,
    @Param('id') id: number,
  ): Promise<number> {
    return this.tasksService.deleteTask(id, user.currentUser.id);
  }
}
