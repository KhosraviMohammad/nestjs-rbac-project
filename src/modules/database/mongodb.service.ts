import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class MongoDBService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async onModuleInit() {
    console.log('MongoDB connected successfully');
  }

  async onModuleDestroy() {
    await this.connection.close();
    console.log('MongoDB connection closed');
  }

  getConnection(): Connection {
    return this.connection;
  }
}
