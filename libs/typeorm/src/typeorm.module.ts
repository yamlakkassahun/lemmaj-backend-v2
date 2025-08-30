/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module, DynamicModule, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModule as NestjsTypeOrmModule,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { DEFAULT_DATA_SOURCE_NAME } from '@nestjs/typeorm/dist/typeorm.constants';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import * as fs from 'fs';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { TYPEORM_MODULE_OPTIONS } from './typeorm.constant';
import { TypeormMigrationService } from './typeorm-migration.service';

@Global()
@Module({})
export class TypeormModule {
  static forRoot(options: TypeOrmModuleOptions = {}): DynamicModule {
    return this.createModule([
      {
        provide: TYPEORM_MODULE_OPTIONS,
        useValue: options,
      },
    ]);
  }

  static forRootAsync(options: {
    imports?: any[];
    inject?: any[];
    useFactory: (
      ...args: any[]
    ) => Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions;
  }): DynamicModule {
    return this.createModule(
      [
        {
          provide: TYPEORM_MODULE_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
      ],
      options.imports || [],
    );
  }

  static forFeature(
    entities: EntityClassOrSchema[] = [],
    dataSource: string = DEFAULT_DATA_SOURCE_NAME,
  ): DynamicModule {
    return NestjsTypeOrmModule.forFeature(entities, dataSource);
  }

  private static createModule(
    providers: any[],
    imports: any[] = [],
  ): DynamicModule {
    return {
      module: TypeormModule,
      imports: [
        ConfigModule,
        ...imports,
        NestjsTypeOrmModule.forRootAsync({
          inject: [TYPEORM_MODULE_OPTIONS, ConfigService],
          useFactory: (
            customOpts: TypeOrmModuleOptions,
            config: ConfigService,
          ): TypeOrmModuleOptions => {
            const isTLS = config.get<boolean>('db.tlsEnabled');
            const tlsCAPath = config.get<string>('db.tlsCAPath');

            const ssl = isTLS
              ? tlsCAPath
                ? { ca: fs.readFileSync(tlsCAPath) }
                : true
              : false;

            return {
              type: config.get<'mysql'>('DB_TYPE') || 'mysql',
              host: config.get<string>('db.host'),
              port: config.get<number>('db.port'),
              username: config.get<string>('db.user'),
              password: config.get<string>('db.password') || '',
              database: config.get<string>('db.name'),
              schema: config.get<string>('db.schema'),
              namingStrategy: new SnakeNamingStrategy(),
              ssl,
              autoLoadEntities: true,
              entities: ['./node_modules/**/entities/*.entity.{js,ts}'],
              migrations: [
                `${config.get('db.migration.distRoot')}/**/${config.get('db.migration.dirname')}/**/*{.ts,.js}`,
              ],
              migrationsTableName: config.get<string>('db.migration.table'),
              subscribers: [
                `${config.get('db.migration.distRoot')}/**/*.subscriber{.ts,.js}`,
              ],
              synchronize:
                !config.get<boolean>('db.migration.enabled') &&
                config.get<string>('env') !== 'production',
              logging: false,
              // logger: new TypeOrmLogger(
              //   config.get<LoggerOptions>('db.logging'),
              // ),
              ...customOpts,
            } as TypeOrmModuleOptions;
          },
        }),
      ],
      providers: [...providers, TypeormMigrationService],
      exports: [TYPEORM_MODULE_OPTIONS, NestjsTypeOrmModule],
    };
  }
}
