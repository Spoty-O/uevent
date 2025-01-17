import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const UserServiceMock: Partial<UserService> = {
    create: jest.fn().mockReturnValue('User created with id 1'),
    findAll: jest.fn().mockReturnValue([]),
    findOne: jest.fn().mockReturnValue({ id: 1 }),
    update: jest.fn().mockReturnValue('User updated with id 1'),
    remove: jest.fn().mockReturnValue('User deleted with id 1'),
  };

  const dto: CreateUserDto = {
    email: 'opa@gm.com',
    password: '1234562314er_dsrfASD',
    username: 'papapap',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: UserServiceMock }],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create method of service', async () => {
    expect(controller.create(dto)).toEqual('User created with id 1');
    expect(service.create).toHaveBeenCalledTimes(1);
  });
});
