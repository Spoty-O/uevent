import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './env.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { ApiConfigService } from './env.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validate,
    }),
    TypeOrmModule.forRootAsync({
      // inject: [ApiConfigService],
      // useFactory: (conf: ApiConfigService): TypeOrmModuleOptions => ({
      //   conf.,
      // }),
    }),
  ],
  // providers: [ApiConfigService],
  // exports: [ApiConfigService],
})
export class AppModule {}
