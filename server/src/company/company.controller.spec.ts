import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

describe('CompanyController', () => {
  let controller: CompanyController;
  let service: CompanyService;

  const CompanyServiceMock: Partial<CompanyService> = {
    create: jest.fn().mockReturnValue('Company created with id 1'),
    findAll: jest.fn().mockReturnValue([]),
    findOne: jest.fn().mockReturnValue({ id: 1 }),
    update: jest.fn().mockReturnValue('Company updated with id 1'),
    remove: jest.fn().mockReturnValue('Company deleted with id 1'),
  };

  const dto: CreateCompanyDto = {
    email: 'opa@gm.com',
    name: 'Company',
  };

  const upddto: UpdateCompanyDto = {
    email: 'opa1@gm.com',
    name: 'Company1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [{ provide: CompanyService, useValue: CompanyServiceMock }],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
    service = module.get<CompanyService>(CompanyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create company with id = 1', async () => {
    expect(controller.create(dto)).toEqual('Company created with id 1');
    expect(service.create).toHaveBeenCalledTimes(1);
    expect(dto).toMatchSnapshot();
  });

  it('find one company', async () => {
    expect(controller.findOne(1)).toEqual({ id: 1 });
    expect(service.findOne).toHaveBeenCalledTimes(1);
    expect({ id: 1 }).toMatchSnapshot();
  });

  it('find all company', async () => {
    expect(controller.findAll()).toEqual([]);
    expect(service.findAll).toHaveBeenCalledTimes(1);
    expect([]).toMatchSnapshot();
  });

  it('update company data', async () => {
    expect(controller.update(1, upddto)).toEqual('Company updated with id 1');
    expect(service.update).toHaveBeenCalledTimes(1);
    expect(upddto).toMatchSnapshot();
  });

  it('delete company data', async () => {
    expect(controller.remove(1)).toEqual('Company deleted with id 1');
    expect(service.remove).toHaveBeenCalledTimes(1);
  });
});
