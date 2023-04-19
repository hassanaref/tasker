import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../../entities/task/task.entity';
import { taskInput, taskUpdateInput } from 'src/entities/task/task.input';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  async getTasks(id: number, skip = 1): Promise<Task[]> {
    try {
      skip = skip * 10 - 10;
      return this.tasksRepository.find({
        skip,
        take: 10,
        where: { user: { id } },
      });
    } catch (err) {
      throw new HttpException('finding tasks failed', 500);
    }
  }

  async createTask(task: taskInput, id: number): Promise<Task> {
    try {
      return this.tasksRepository.save({ ...task, user: { id } });
    } catch (err) {
      throw new HttpException('creating task failed', 500);
    }
  }

  async updateTask(task: taskUpdateInput): Promise<Task> {
    try {
      await this.tasksRepository.update({ id: task.id }, { ...task });
      return this.tasksRepository.findOne({ where: { id: task.id } });
    } catch (err) {
      throw new HttpException('updating task failed', 500);
    }
  }

  async deleteTask(id: number, userId: number): Promise<number> {
    try {
      return (await this.tasksRepository.delete({ id, user: { id: userId } }))
        .affected;
    } catch (err) {
      throw new HttpException('deleting task failed', 500);
    }
  }
}
