import { NestFactory } from '@nestjs/core';
import {AppModule} from "../../microservices/src/app.module";
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import {MsCOrdersModule} from "./ms-c-orders.module";


async function bootstrap() {
  const app = await NestFactory.create(MsCOrdersModule, {});
  await app.listen((3003));
}

bootstrap();
