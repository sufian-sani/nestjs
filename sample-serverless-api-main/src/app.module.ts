import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogModule } from './blog/blog.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite', // SQLite database file
      autoLoadEntities: true,      // Automatically load entities
      synchronize: true,           // Auto-sync DB schema (dev only)
    }),
    BlogModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
