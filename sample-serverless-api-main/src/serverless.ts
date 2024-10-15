import { Handler, Context, Callback, APIGatewayEvent } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as awsServerlessExpress from 'aws-serverless-express';
import { ExpressAdapter } from '@nestjs/platform-express';
const express = require('express');

const expressApp = express();
let server: any;

async function bootstrap() {
    if (!server) {
        const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
        await app.init();
        server = awsServerlessExpress.createServer(expressApp);
    }
    return server;
}

export const handler: Handler = async (event: APIGatewayEvent, context: Context) => {
    const server = await bootstrap();
    return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;
};
