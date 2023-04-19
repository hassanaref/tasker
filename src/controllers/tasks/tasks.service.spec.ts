import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../../entities/task/task.entity';
import { HttpException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { User } from 'src/entities';

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository: Repository<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    tasksRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  describe('getTasks', () => {
    it('should return an array of tasks for a user', async () => {
      const expectedTasks = [
        {
          id: 1,
          title: 'Task 1',
          user: { id: 1 } as User,
          description: 'description',
          status: 'status',
        },
      ];
      jest.spyOn(tasksRepository, 'find').mockResolvedValue(expectedTasks);
      const tasks = await tasksService.getTasks(1);
      expect(tasks).toEqual(expectedTasks);
    });

    it('should throw an HttpException if finding tasks fails', async () => {
      jest
        .spyOn(tasksRepository, 'find')
        .mockRejectedValue(new HttpException('finding tasks failed', 500));
      await expect(tasksService.getTasks(1)).rejects.toThrow(HttpException);
    });
  });

  describe('createTask', () => {
    it('should create a task for a user', async () => {
      const newTask = {
        title: 'Task 1',
        description: 'description',
        status: 'status',
      };
      const expectedTask = { id: 1, ...newTask, user: { id: 1 } as User };
      jest.spyOn(tasksRepository, 'save').mockResolvedValue(expectedTask);
      const task = await tasksService.createTask(newTask, 1);
      expect(task).toEqual(expectedTask);
    });

    it('should throw an HttpException if creating task fails', async () => {
      const newTask = {
        title: 'Task 1',
        description: 'description',
        status: 'status',
      };
      jest
        .spyOn(tasksRepository, 'save')
        .mockRejectedValue(new HttpException('creating task failed', 500));
      await expect(tasksService.createTask(newTask, 1)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('updateTask', () => {
    it('should update a task', async () => {
      const updatedTask = {
        id: 1,
        title: 'Task 1 updated',
        description: 'description',
        status: 'status',
      };
      const expectedTask = {
        id: 1,
        title: 'Task 1 updated',
        user: { id: 1 } as User,
        description: 'description',
        status: 'status',
      };
      jest.spyOn(tasksRepository, 'update').mockResolvedValue(undefined);
      jest.spyOn(tasksRepository, 'findOne').mockResolvedValue(expectedTask);
      const task = await tasksService.updateTask(updatedTask);
      expect(task).toEqual(expectedTask);
    });

    it('should throw an HttpException if updating task fails', async () => {
      const updatedTask = {
        id: 1,
        title: 'Task 1 updated',
        description: 'description',
        status: 'status',
      };
      jest.spyOn(tasksRepository, 'update').mockRejectedValue(new Error());
      await expect(tasksService.updateTask(updatedTask)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      jest
        .spyOn(tasksRepository, 'delete')
        .mockResolvedValue({ raw: '', affected: 1 });
      const affected = await tasksService.deleteTask(1, 1);
      expect(affected).toEqual;
    });
  });
});
