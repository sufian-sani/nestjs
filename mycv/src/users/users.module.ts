import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity'
import {AuthService} from "./auth.service";
// import {CurrentUserInterceptor} from "./interceptors/current-user.interceptor";
// import {APP_INTERCEPTOR} from "@nestjs/core";
import {CurrentUserMiddleware} from "./middlewares/current-user.middleware";
const cookieSession = require('cookie-session');

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
      UsersService,
      AuthService,
      // {
      //   provide: APP_INTERCEPTOR,
      //   useClass: CurrentUserInterceptor
      // }
  ],
})
export class UsersModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CurrentUserMiddleware).forRoutes('*');
    }
}
