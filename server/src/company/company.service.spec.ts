import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, EntityManager, QueryRunner, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Company } from './entities/company.entity';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { User } from 'src/user/entities/user.entity';

describe('CompanyService', () => {
  let service: CompanyService;
  let dataSource: DataSource;
  let companyRepository: Repository<Company>;
  let manager: EntityManager;

  const entityManagerMock: Partial<EntityManager> = {
    findOneBy: jest.fn(),
    save: jest.fn().mockReturnValue({ id: 1 }),
    update: jest.fn().mockReturnValue({ id: 1 }),
    delete: jest.fn().mockReturnValue({ id: 1 }),
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

  const companyRepositoryMock: Partial<Repository<Company>> = {
    find: jest.fn().mockReturnValue([]),
    findOne: jest.fn().mockReturnValue({ id: 1 }),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const dto: CreateCompanyDto = {
    email: 'opa@gm.com',
    name: 'Company',
  };

  const userMock: User = {
    id: 1,
    email: 'user@us.com',
    password: 'pass',
    confirmed: false,
    role: 'user',
    username: 'user',
    picturePath: '',
    visible: true,
  };

  const createdCompany: Company = {
    id: 1,
    email: 'fdgh@sd.com',
    name: 'Company',
    picturePath: '/public/default_company_img.gif',
    approved: false,
    description: '',
    user: userMock,
  };

  const upddto: UpdateCompanyDto = {
    email: 'opa1@gm.com',
    name: 'Company1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        { provide: DataSource, useValue: dataSourceMock },
        {
          provide: getRepositoryToken(Company),
          useValue: companyRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    dataSource = module.get<DataSource>(DataSource);
    companyRepository = module.get<Repository<Company>>(
      getRepositoryToken(Company),
    );
    manager = dataSource.createQueryRunner().manager;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create company', async () => {
    jest.spyOn(manager, 'findOneBy').mockResolvedValue(null);
    jest.spyOn(manager, 'save').mockResolvedValue({ id: 1 });
    expect(service.create(dto)).resolves.toEqual('Company created with id 1');
  });

  it('company already exists', async () => {
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
  it('find all an array of companies', async () => {
    jest.spyOn(companyRepository, 'find').mockResolvedValue([]);
    await expect(service.findAll()).resolves.toEqual([]);
    expect(companyRepository.find).toHaveBeenCalled();
  });

  it('error find all', async () => {
    jest.spyOn(companyRepository, 'find').mockImplementation(() => {
      throw new Error('Unexpected error');
    });
    await expect(service.findAll()).rejects.toThrow(
      InternalServerErrorException,
    );
    expect(companyRepository.find).toHaveBeenCalled();
  });

  //find one user
  it('find one', async () => {
    jest.spyOn(companyRepository, 'findOne').mockResolvedValue(createdCompany);
    await expect(service.findOne(1)).resolves.toMatchObject({ id: 1 });
    expect(companyRepository.findOne).toHaveBeenCalled();
  });

  it('error find one', async () => {
    jest.spyOn(companyRepository, 'findOne').mockImplementation(() => {
      throw new Error('Unexpected error');
    });
    await expect(service.findOne(1)).rejects.toThrow(
      InternalServerErrorException,
    );
    expect(companyRepository.findOne).toHaveBeenCalled();
  });

  //update user(s)
  //
  it('should update company', async () => {
    jest.spyOn(manager, 'findOneBy').mockResolvedValue(createdCompany);
    jest.spyOn(manager, 'update').mockResolvedValue(undefined);
    await expect(service.update(1, upddto)).resolves.toEqual(
      'Company updated with id 1',
    );
  });

  //
  it('should throw NotFoundException if company not found', async () => {
    jest.spyOn(manager, 'findOneBy').mockResolvedValue(null);
    await expect(service.update(1, upddto)).rejects.toThrow(NotFoundException);
    expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalled();
  });

  it('unexpected error', async () => {
    jest.spyOn(manager, 'findOneBy').mockRejectedValue(() => {
      throw new Error('Unexpected error');
    });
    await expect(service.update(1, upddto)).rejects.toThrow(
      InternalServerErrorException,
    );
    expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalled();
  });

  //delete user(s)
  //
  it('should delete company', async () => {
    jest.spyOn(manager, 'findOneBy').mockResolvedValue(dto);
    await expect(service.remove(1)).resolves.toEqual(
      'Company deleted with id undefined',
    );
  });

  //
  it('should throw NotFoundException if company not found', async () => {
    jest.spyOn(manager, 'findOneBy').mockResolvedValue(null);
    await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalled();
  });

  it('unexpected error', async () => {
    jest.spyOn(manager, 'findOneBy').mockRejectedValue(() => {
      throw new Error('Unexpected error');
    });
    await expect(service.remove(1)).rejects.toThrow(
      InternalServerErrorException,
    );
    expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalled();
  });
});
