import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { DataSource, EntityManager, QueryRunner, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserService', () => {
  let service: UserService;
  let dataSource: DataSource;
  let userRepository: Repository<User>;
  let manager: EntityManager;

  const entityManagerMock: Partial<EntityManager> = {
    findOneBy: jest.fn(),
    save: jest.fn().mockReturnValue({ id: 1 }),
  };

  const queryRunnerMock: Partial<QueryRunner> = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: entityManagerMock as EntityManager,
  };

  const dataSourceMock: Partial<DataSource> = {
    createQueryRunner: jest.fn().mockReturnValue(queryRunnerMock),
  };

  const userRepositoryMock: Partial<Repository<User>> = {
    find: jest.fn().mockReturnValue([]),
    findOne: jest.fn().mockReturnValue({ id: 1 }),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const dto: CreateUserDto = {
    email: 'opa@gm.com',
    password: '1234562314er_dsrfASD',
    username: 'papapap',
  };
  const createdUser: User = {
    id: 1,
    email: 'newopa@gm.com',
    password: '1234562314er_dsrfASD',
    username: 'papapap',
    role: 'user',
    picturePath: '',
    confirmed: false,
    visible: true,
  };
  const udto: UpdateUserDto = {
    email: 'newopa@gm.com',
    password: '1234562314er_dsrfASD',
    username: 'papapap',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: DataSource, useValue: dataSourceMock },
        { provide: getRepositoryToken(User), useValue: userRepositoryMock },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    dataSource = module.get<DataSource>(DataSource);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    manager = dataSource.createQueryRunner().manager;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //create user(s)
  it('should create user', async () => {
    jest.spyOn(manager, 'findOneBy').mockResolvedValue(null);
    jest.spyOn(manager, 'save').mockResolvedValue({ id: 1 });
    const res = await service.create(dto);
    expect(res).toEqual('User created with id 1');
  });

  it('user already exists', async () => {
    jest.spyOn(manager, 'findOneBy').mockResolvedValue({ id: 1 });
    await expect(service.create(dto)).rejects.toThrow(ConflictException);
    expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalled();
  });

  it('unexpected error', async () => {
    jest.spyOn(manager, 'findOneBy').mockImplementation(() => {
      throw new Error('Unexpected error');
    });
    await expect(service.create(dto)).rejects.toThrow(
      InternalServerErrorException,
    );
    expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalled();
  });

  //find all user
  it('find all an array of users', async () => {
    jest.spyOn(userRepository, 'find').mockResolvedValue([]);
    expect(await service.findAll()).toEqual([]);
    expect(userRepository.find).toHaveBeenCalled();
  });

  it('error find all', async () => {
    jest.spyOn(userRepository, 'find').mockImplementation(() => {
      throw new Error('Unexpected error');
    });
    await expect(service.findAll()).rejects.toThrow(
      InternalServerErrorException,
    );
    expect(userRepository.find).toHaveBeenCalled();
  });

  //find one user
  //
  it('find one', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(createdUser);
    expect(await service.findOne(1)).toEqual({ id: 1 });
    expect(userRepository.findOne).toHaveBeenCalled();
  });

  it('error find one', async () => {
    jest.spyOn(userRepository, 'findOne').mockImplementation(() => {
      throw new Error('Unexpected error');
    });
    await expect(service.findOne(1)).rejects.toThrow(
      InternalServerErrorException,
    );
    expect(userRepository.findOne).toHaveBeenCalled();
  });

  //update user(s)
  //
  it('should update user', async () => {
    jest.spyOn(manager, 'findOne').mockResolvedValue(createdUser);
    jest.spyOn(manager, 'update').mockResolvedValue(undefined);
    const res = await service.update(1, udto);
    expect(res).toEqual('User updates with id 1');
  });

  //
  it('should throw NotFoundException if user not found', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
    await expect(service.update(1, dto)).rejects.toThrow(NotFoundException);
    expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalled();
  });

  it('unexpected error', async () => {
    jest.spyOn(userRepository, 'findOne').mockRejectedValue(() => {
      throw new Error('Unexpected error');
    });
    await expect(service.update(1, dto)).rejects.toThrow(
      InternalServerErrorException,
    );
    expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalled();
  });

  //delete user(s)
  //
  it('should delete user', async () => {
    jest.spyOn(manager, 'findOne').mockResolvedValue(dto);
    const res = await service.remove(1);
    expect(res).toEqual('User with id 1 was successful deleted');
  });

  //
  it('should throw NotFoundException if user not found', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
    await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalled();
  });

  it('unexpected error', async () => {
    jest.spyOn(userRepository, 'findOne').mockRejectedValue(() => {
      throw new Error('Unexpected error');
    });
    await expect(service.remove(1)).rejects.toThrow(
      InternalServerErrorException,
    );
    expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalled();
  });
});
