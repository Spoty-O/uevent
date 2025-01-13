import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './env.validation';
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

// @Injectable()
// export class ApiConfigService {
//   constructor(private configService: ConfigService<EnvironmentVariables>) {}

//   get port(): number {
//     return this.configService.get('POSTGRES_PORT');
//   }

//   get host(): string {
//     return this.configService.get('POSTGRES_HOST');
//   }

//   get password(): string {
//     return this.configService.get('POSTGRES_PASSWORD');
//   }

//   get user(): string {
//     return this.configService.get('POSTGRES_USER');
//   }

//   get database(): string {
//     return this.configService.get('POSTGRES_DB');
//   }

//   get type(): string {
//     return this.configService.get('DB_TYPE');
//   }
// }

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService<EnvironmentVariables>) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get('DB_TYPE'),
      host: this.configService.get('POSTGRES_HOST'),
      port: this.configService.get('POSTGRES_PORT'),
      username: this.configService.get('POSTGRES_USER'),
      password: this.configService.get('POSTGRES_PASSWORD'),
      database: this.configService.get('POSTGRES_DB'),
    };
  }
}
