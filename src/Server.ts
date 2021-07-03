import { CustomExceptionFilter } from '@common/errors/handler/CustomExceptionFilter';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import http from 'http';
import { Application } from './Application';

async function start() {
  const server = express();
  const app = await NestFactory.create(Application, new ExpressAdapter(server));  

  app.enableCors({
    origin: process.env.CLIENT_URL || 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalFilters(new CustomExceptionFilter());  

  await app.init();

  http.createServer(server).listen(process.env.PORT || 8080);
}

start();
