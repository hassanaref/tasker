import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities/user/user.entity';
import { HttpException, UnauthorizedException } from '@nestjs/common';
import { userInput, userUpdateInput } from '../../entities/user/user.input';

jest.mock('bcryptjs', () => ({
  compare: jest.fn().mockReturnValue(true),
  hash: jest.fn(),
}));

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepositoryMock;

  const mockUser: User = {
    id: 1,
    email: 'test@test.com',
    password: 'password',
    name: 'name',
    tasks: [],
  };

  beforeEach(async () => {
    usersRepositoryMock = {
      find: jest.fn().mockResolvedValue([mockUser]),
      findOne: jest.fn().mockResolvedValue(mockUser),
      save: jest.fn().mockResolvedValue(mockUser),
      update: jest.fn().mockResolvedValue(true),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: usersRepositoryMock,
        },
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const result = await usersService.getUsers();
      expect(usersRepositoryMock.find).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });

    it('should throw an HttpException when find operation fails', async () => {
      usersRepositoryMock.find.mockRejectedValue(
        new HttpException('finding users failed', 500),
      );
      await expect(usersService.getUsers()).rejects.toThrow(HttpException);
    });
  });

  describe('create', () => {
    it('should create a new user and return user data', async () => {
      const newUser: userInput = {
        email: 'newuser@test.com',
        password: 'password',
        name: 'name',
      };
      jest.spyOn(usersRepositoryMock, 'findOne').mockResolvedValueOnce(null);
      const result = await usersService.create(newUser);
      expect(usersRepositoryMock.findOne).toHaveBeenCalled();
      expect(usersRepositoryMock.save).toHaveBeenCalled();
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
      });
    });

    it('should throw an HttpException when email address is already taken', async () => {
      usersRepositoryMock.findOne.mockResolvedValue(mockUser);
      const newUser: userInput = {
        email: 'test@test.com',
        password: 'password',
        name: 'name',
      };
      await expect(usersService.create(newUser)).rejects.toThrow(HttpException);
    });
  });

  describe('updateUser', () => {
    it('should update an existing user and return updated user data', async () => {
      const updatedUser: userUpdateInput = {
        name: 'name',
        email: 'newemail@test.com',
        password: 'password',
      };
      const result = await usersService.updateUser(mockUser.id, updatedUser);
      expect(usersRepositoryMock.update).toHaveBeenCalled();
      expect(result).toEqual({
        id: 1,
        email: 'test@test.com',
        password: 'password',
        name: 'name',
        tasks: [],
      });
    });

    it('should throw an HttpException when update operation fails', async () => {
      usersRepositoryMock.update.mockRejectedValue(new Error());
      const updatedUser: userUpdateInput = {
        name: 'name',
        email: 'newemail@test.com',
        password: 'password',
      };
      await expect(
        usersService.updateUser(mockUser.id, updatedUser),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('deleteUser', () => {
    it('should delete the user with the given id and return the number of affected rows', async () => {
      const id = 1;
      const result = await usersService.deleteUser(id);
      expect(usersRepositoryMock.delete).toHaveBeenCalledWith(id);
      expect(result).toEqual(1);
    });

    it('should throw an HttpException with status code 500 if deleting the user fails', async () => {
      const id = 1;
      jest
        .spyOn(usersRepositoryMock, 'delete')
        .mockRejectedValueOnce(new HttpException('deleting user failed', 500));
      await expect(usersService.deleteUser(id)).rejects.toThrow(HttpException);
    });
  });

  describe('findByEmail', () => {
    it('should return user', async () => {
      const result = await usersService.findByEmail('email');
      expect(usersRepositoryMock.findOne).toHaveBeenCalled();
      expect(result).toBe(mockUser);
    });
  });

  describe('login', () => {
    it('should return user', async () => {
      const login = { email: 'email', password: 'password' };
      const result = await usersService.login(login);
      expect(result).toBe(mockUser);
    });

    it('should throw error if trying to login with invalid user', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(null);
      const login = { email: 'email', password: 'password' };
      await expect(usersService.login(login)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('findById', () => {
    it('should return user', async () => {
      const result = await usersService.findById(1);
      expect(usersRepositoryMock.findOne).toHaveBeenCalled();
      expect(result).toBe(mockUser);
    });
  });
});
