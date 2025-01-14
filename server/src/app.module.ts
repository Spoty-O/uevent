import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate } from './env.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './env.service';
// import { ApiConfigService } from './env.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validate,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      inject: [ConfigService],
    }),
  ],
  // providers: [ApiConfigService],
  // exports: [ApiConfigService],
})
export class AppModule {}
