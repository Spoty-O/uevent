import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private eventRepository: Repository<Event>,
    private dataSource: DataSource,
  ) {}

  async create(createEventDto: CreateEventDto) {
    console.log(createEventDto);
    try {
      const event = await this.eventRepository.save(createEventDto);
      console.log(event);
      return `Event created with id ${event.id}`;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    try {
      return await this.eventRepository.find();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number) {
    try {
      return await this.eventRepository.findOne({ where: { id } });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const event = await queryRunner.manager.findOneBy(Event, {
        id,
      });
      if (!event) {
        throw new NotFoundException('Event does not exist');
      }
      await queryRunner.manager.update(Event, id, updateEventDto);
      await queryRunner.commitTransaction();
      return `Event updated with id ${event.id}`;
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
      const event = await queryRunner.manager.findOneBy(Event, {
        id,
      });
      if (!event) {
        throw new NotFoundException('Event does not exist');
      }
      await queryRunner.manager.delete(Event, id);
      await queryRunner.commitTransaction();
      return `Event with id ${event.id} has been deleted`;
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
