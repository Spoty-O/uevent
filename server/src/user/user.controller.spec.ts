import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidationPipe } from '../pipes/validation.pipe';
import { ArgumentMetadata } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  // let service: UserService;
  let validation: ValidationPipe;

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
    // service = module.get<UserService>(UserService);
    validation = new ValidationPipe();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create route', () => {
    const dto: CreateUserDto = {
      email: 'opa@gm.com',
      password: '1234562314er_dsrfASD',
      username: 'papapap',
    };
    it('should call create method of service', async () => {
      const obj: ArgumentMetadata = {
        type: 'body',
        data: JSON.stringify(dto),
        metatype: CreateUserDto,
      };
      // controller.create(dto);
      expect(controller.create(await validation.transform(dto, obj))).toEqual(
        dto,
      );
    });

    it.failing('shoud`t call create method of service', async () => {
      dto.password = '123';
      const obj: ArgumentMetadata = {
        type: 'body',
        data: JSON.stringify(dto),
        metatype: CreateUserDto,
      };
      // controller.create(dto);
      expect(controller.create(await validation.transform(dto, obj))).toEqual(
        dto,
      );
    });
  });
});
