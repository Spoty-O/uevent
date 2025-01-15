import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

interface User {
  id: number;
  email: string;
  password: string;
  username: string;
}

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  describe('create', () => {
    it('should create a new user and return it as a string', async () => {
      const createUserDto: CreateUserDto = {
        email: 'john.doe@example.com',
        password: 'StrongPass123',
        username: 'johndoe',
      };
      const result: User = {
        id: 1,
        email: createUserDto.email,
        password: createUserDto.password,
        username: createUserDto.username,
      };
  
      // Конвертация объекта User в строку
      const resultAsString = JSON.stringify(result);
  
      jest.spyOn(service, 'create').mockResolvedValue(resultAsString);
      expect(await controller.create(createUserDto)).toBe(resultAsString);
    });
  });

   describe('findAll', () => {
    it('should return an array of users', async () => {
      const result: User[] = [
        { id: 1, email: 'john.doe@example.com', password: 'StrongPass123', username: 'johndoe' },
        { id: 2, email: 'jane.doe@example.com', password: 'StrongPass456', username: 'janedoe' },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(result);  // Мокаем возвращаемое значение как массив объектов User
      expect(await controller.findAll()).toEqual(result);  // Проверяем, что метод возвращает массив объектов User
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const result: User = { id: 1, email: 'john.doe@example.com', password: 'StrongPass123', username: 'johndoe' };

      jest.spyOn(service, 'findOne').mockResolvedValue(result);  // Мокаем возвращаемое значение как объект User
      expect(await controller.findOne('1')).toEqual(result);  // Проверяем, что метод возвращает объект User
    });
  });

  describe('update', () => {
    it('should update a user and return the updated user as a string', async () => {
      const updateUserDto: UpdateUserDto = { username: 'johnUpdated' };
      const result: User = { id: 1, email: 'john.doe@example.com', password: 'StrongPass123', username: 'johnUpdated' };

      const resultAsString = JSON.stringify(result);
      jest.spyOn(service, 'update').mockResolvedValue(resultAsString);

      expect(await controller.update('1', updateUserDto)).toBe(resultAsString);
    });
  });

  describe('remove', () => {
    it('should remove a user and return a confirmation string', async () => {
      const result = 'User removed successfully';

      jest.spyOn(service, 'remove').mockResolvedValue(result);

      expect(await controller.remove('1')).toBe(result);
    });
  });

});

