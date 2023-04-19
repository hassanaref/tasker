import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from '../../auth/auth.service';
import { IAuthDetail } from 'src/auth/auth.interfaces';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService = {
    getUsers: jest.fn(),
    create: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    login: jest.fn(),
  };
  let authService = { generateUserCredentials: jest.fn() };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: usersService },
        { provide: AuthService, useValue: authService },
      ],
    }).compile();

    usersController = moduleRef.get<UsersController>(UsersController);
  });

  describe('getUsers', () => {
    it('should return a list of users', async () => {
      const users = [
        {
          id: 1,
          name: 'John Doe',
          email: 'email',
          password: 'password',
          tasks: [],
        },
      ];
      jest.spyOn(usersService, 'getUsers').mockResolvedValue(users);

      expect(await usersController.getUsers()).toBe(users);
    });
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const user = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
      };
      jest.spyOn(usersService, 'create').mockResolvedValue(user);

      expect(await usersController.createUser(user)).toBe(user);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const authDetail: IAuthDetail = {
        currentUser: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password',
          tasks: [],
        },
        ip: '',
      };
      const input = {
        name: 'Jane Doe',
        email: 'john@example.com',
        password: 'password',
      };
      const updatedUser = {
        id: 1,
        name: 'Jane Doe',
        email: 'john@example.com',
        password: 'password',
        tasks: [],
      };
      jest.spyOn(usersService, 'updateUser').mockResolvedValue(updatedUser);

      expect(await usersController.updateUser(authDetail, input)).toBe(
        updatedUser,
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const authDetail: IAuthDetail = {
        currentUser: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password',
          tasks: [],
        },
        ip: '',
      };
      jest.spyOn(usersService, 'deleteUser').mockResolvedValue(1);

      expect(await usersController.deleteUser(authDetail)).toBe(1);
    });
  });

  describe('login', () => {
    it('should return a login response', async () => {
      const credentials = { email: 'john@example.com', password: 'password' };
      const user = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
        tasks: [],
      };
      const token = { access_token: 'jwt_token' };
      jest.spyOn(usersService, 'login').mockResolvedValue(user);
      jest
        .spyOn(authService, 'generateUserCredentials')
        .mockResolvedValue(token);

      const expectedResponse = {
        id: user.id,
        email: user.email,
        jwtToken: token.access_token,
      };
      expect(await usersController.login(credentials)).toEqual(
        expectedResponse,
      );
    });
  });
});
