import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CsvExportService } from './csv-export.service';

@Module({
  providers: [UsersService, CsvExportService],
  controllers: [UsersController],
  exports: [UsersService, CsvExportService],
})
export class UsersModule {}
