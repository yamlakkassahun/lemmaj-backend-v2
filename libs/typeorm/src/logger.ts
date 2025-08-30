/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger } from '@nestjs/common';
import { LoggerOptions, QueryRunner } from 'typeorm';

export class TypeOrmLogger {
  constructor(private readonly level: LoggerOptions = 'all') {}

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    Logger.log(query, 'TypeORM');
  }

  logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    Logger.error(error, query, 'TypeORM');
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    Logger.warn(`Slow Query (${time}ms): ${query}`, 'TypeORM');
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    Logger.log(message, 'TypeORM');
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    Logger.log(message, 'TypeORM');
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    Logger.log(message, 'TypeORM');
  }
}
