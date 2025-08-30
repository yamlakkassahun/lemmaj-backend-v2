import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule, AuthenticationGuard } from '@app/auth';
import { ENTITIES } from '@app/db';
import { LessonMaterialModule } from '@app/lesson-material';
import { ParametersModule } from '@app/parameters';
import { TypeormModule } from '@app/typeorm';
import dbConfig from '@app/typeorm/db.config';
import { UserModule } from '@app/user';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig],
    }),
    TypeormModule.forRootAsync({
      useFactory: () => ({
        entities: ENTITIES,
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'images'),
    }),
    AuthModule,
    UserModule,
    ParametersModule,
    LessonMaterialModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
})
export class AppModule { }
