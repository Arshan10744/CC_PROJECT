import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './orm/db/datasource';
import { InfrastructureControllerModule } from './presenter/infrastructureModule';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    InfrastructureControllerModule,
  ],
})
export class AppModule {}
