import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './orm/db/datasource';
import { InfrastructureControllerModule } from './presenter/infrastructureModule';
import { ConfigModule } from '@nestjs/config';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    InfrastructureControllerModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
  ],
})
export class AppModule {}
