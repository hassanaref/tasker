import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from '../../entities/task/task.entity';
import { IAuthDetail } from 'src/auth/auth.interfaces';
import { User } from 'src/entities';

describe('TasksController', () => {
  let tasksController: TasksController;
  let tasksService: TasksService;

  const mockTasks: Task[] = [
    {
      id: 1,
      title: 'Task 1',
      description: 'Task 1 description',
      status: 'status',
      user: { id: 1 } as User,
    },
    {
      id: 2,
      title: 'Task 2',
      description: 'Task 2 description',
      status: 'status',
      user: { id: 1 } as User,
    },
  ];

  const mockUser: IAuthDetail = {
    currentUser: {
      id: 1,
      name: 'name',
      email: 'test@test.com',
      password: 'password',
      tasks: [],
    },
    ip: 'ip',
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            getTasks: jest.fn().mockResolvedValue(mockTasks),
            createTask: jest.fn().mockResolvedValue(mockTasks[0]),
            updateTask: jest.fn().mockResolvedValue(mockTasks[0]),
            deleteTask: jest.fn().mockResolvedValue(1),
          },
        },
      ],
    }).compile();

    tasksController = app.get<TasksController>(TasksController);
    tasksService = app.get<TasksService>(TasksService);
  });

  describe('getTasks', () => {
    it('should return an array of tasks', async () => {
      const result = await tasksController.getTasks(1, mockUser);

      expect(result).toEqual(mockTasks);
    });
  });

  describe('createTask', () => {
    it('should return a created task', async () => {
      const newTask = {
        title: 'New Task',
        description: 'New Task description',
        status: 'status',
      };

      const result = await tasksController.createTask(mockUser, newTask);

      expect(result).toEqual(mockTasks[0]);
      expect(tasksService.createTask).toHaveBeenCalledWith(newTask, 1);
    });
  });

  describe('updateTask', () => {
    it('should return an updated task', async () => {
      const updatedTask = {
        id: 1,
        title: 'Updated Task',
        description: 'Updated Task description',
        status: 'status',
      };

      const result = await tasksController.updateTask(updatedTask);

      expect(result).toEqual(mockTasks[0]);
      expect(tasksService.updateTask).toHaveBeenCalledWith(updatedTask);
    });
  });

  describe('deleteTask', () => {
    it('should return the number of deleted tasks', async () => {
      const result = await tasksController.deleteTask(mockUser, 1);

      expect(result).toEqual(1);
      expect(tasksService.deleteTask).toHaveBeenCalledWith(1, 1);
    });
  });
});
