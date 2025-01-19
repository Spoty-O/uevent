import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto) {
    console.log(createUserDto);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let user = await queryRunner.manager.findOneBy(User, {
        email: createUserDto.email,
      });
      if (user) {
        throw new ConflictException('User already exists');
      }
      user = await queryRunner.manager.save(User, createUserDto);
      await queryRunner.commitTransaction();
      return `User created with id ${user.id}`;
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
      return await this.userRepository.find();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number) {
    try {
      return await this.userRepository.findOne({ where: { id } });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager.findOneBy(User, {
        id,
      });
      if (!user) {
        throw new NotFoundException('User does not exist');
      }
      await queryRunner.manager.update(User, id, updateUserDto);
      await queryRunner.commitTransaction();
      return `User updated with id ${user.id}`;
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
      const user = await queryRunner.manager.findOneBy(User, {
        id,
      });
      if (!user) {
        throw new NotFoundException('User does not exist');
      }
      await queryRunner.manager.delete(User, id);
      await queryRunner.commitTransaction();
      return `User deleted with id ${user.id}`;
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
