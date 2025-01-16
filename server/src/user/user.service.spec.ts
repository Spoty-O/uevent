import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource } from 'typeorm';
import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  let dataSource: DataSource;

  beforeEach(() => {
    userRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    dataSource = {
      createQueryRunner: jest.fn().mockReturnValue({
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: userRepository,
      }),
    } as any;

    service = new UserService(userRepository, dataSource);
  });

  // create user
  it('should create a user successfully', async () => {
    // Создаем объект, который соответствует CreateUserDto
    const createUserDto: CreateUserDto = {
      email: 'test@test.com',
      password: 'password',  // Пароль для нового пользователя
      username: 'testuser',   // Имя пользователя
    };
  
    // Мок-сущность пользователя с обязательными полями
    const savedUser = {
      id: 1,
      email: 'test@test.com',
      password: 'password',  // Добавляем обязательное поле
      username: 'testuser',   // Добавляем обязательное поле
    };
  
    // Мокируем вызовы репозитория
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);  // Нет пользователя с таким email
    jest.spyOn(userRepository, 'save').mockResolvedValue(savedUser);  // Возвращаем сохраненного пользователя
  
    // Проверяем результат
    const result = await service.create(createUserDto);
    expect(result).toBe(`User created with id ${savedUser.id}`);
  });

  // test for findAll
  it('should return an array of users', async () => {
    const result = [
      { id: 1, email: 'test1@test.com', password: 'password1', username: 'user1' },
      { id: 2, email: 'test2@test.com', password: 'password2', username: 'user2' },
    ];
  
    // Мокаем репозиторий, чтобы он возвращал заранее подготовленные данные
    jest.spyOn(userRepository, 'find').mockResolvedValue(result);
  
    // Вызываем метод findAll и проверяем, что результат совпадает с ожидаемым
    const users = await service.findAll();
    expect(users).toEqual(result);
  });

  // test for findOne 
  it('should return a user by id', async () => {
    const result = { id: 1, email: 'test@test.com', password: 'password', username: 'testuser' };
  
    // Мокаем репозиторий, чтобы он возвращал пользователя по id
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(result);
  
    // Вызываем метод findOne и проверяем, что результат совпадает с ожидаемым
    const user = await service.findOne(1);
    expect(user).toEqual(result);
  });

  // test for findOne if user not found
  it('should throw NotFoundException if user not found', async () => {
    // Мокаем репозиторий, чтобы он возвращал null, то есть пользователя не найдено
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
  
    // Проверяем, что метод выбрасывает ошибку NotFoundException, если пользователь не найден
    await expect(service.findOne(1)).rejects.toThrowError(NotFoundException);
  });
  
  
  
  
});

