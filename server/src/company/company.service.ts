import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Company } from './entities/company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    private dataSource: DataSource,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    console.log(createCompanyDto);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let company = await queryRunner.manager.findOneBy(Company, {
        email: createCompanyDto.email,
      });
      if (company) {
        throw new ConflictException('Company already exists');
      }
      company = await queryRunner.manager.save(Company, createCompanyDto);
      await queryRunner.commitTransaction();
      return `Company created with id ${company.id}`;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    try {
      return await this.companyRepository.find();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number) {
    try {
      return await this.companyRepository.findOne({ where: { id } });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const company = await queryRunner.manager.findOneBy(Company, { id });
      if (!company) {
        throw new NotFoundException('Company does not exist');
      }
      await queryRunner.manager.update(Company, id, updateCompanyDto);
      await queryRunner.commitTransaction();
      return `Company updated with id ${company.id}`;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const company = await queryRunner.manager.findOneBy(Company, { id });
      if (!company) {
        throw new NotFoundException('Company does not exist');
      }
      await queryRunner.manager.delete(Company, id);
      await queryRunner.commitTransaction();
      return `Company deleted with id ${company.id}`;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }
}
