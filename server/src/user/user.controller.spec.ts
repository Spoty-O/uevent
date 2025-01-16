import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const userServiceMock = {
    create: jest.fn((dto: CreateUserDto) => {
      return dto;
    }),
    findAll: jest.fn(() => [CreateUserDto]),
    findOne: jest.fn((id: number) => {
      return { id };
    }),
    update: jest.fn((id: number, dto: UpdateUserDto) => {
      return { id, ...dto };
    }),
    remove: jest.fn((id: number) => {
      return { id };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: userServiceMock }],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create route', () => {
    let dto = new CreateUserDto();
    dto = {
      email: 'opa@gm.com',
      password: '4353QWdsa_1243ldf',
      username: 'papapap',
    };
    it('should call create method of service', () => {
      controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });
});
