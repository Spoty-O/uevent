import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { DataSource, EntityManager, QueryRunner, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { getRepositoryToken } from '@nestjs/typeorm';

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
  };

  const dto: CreateUserDto = {
    email: 'opa@gm.com',
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

  it('should create user', async () => {
    jest.spyOn(manager, 'findOneBy').mockResolvedValue({ id: 1 });
    const res = await service.create(dto);
    expect(res).toEqual('User created with id 1');
  });
});
