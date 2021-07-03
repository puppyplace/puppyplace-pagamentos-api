/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  private response: Response;
  private request: Request;

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    this.response = ctx.getResponse<Response>();
    this.request = ctx.getRequest<Request>();

    if (this[`handle${exception.constructor.name}`]) {
      this[`handle${exception.constructor.name}`](exception);
    } else {
      this.handlerGeneralException(exception);
    }
  }

  handleBadRequestException(exception: BadRequestException): void {
    const status: number = exception.getStatus();
    // @ts-ignore
    const message: string = exception.getResponse().message || exception.message;
    const timestamp: string = new Date().toISOString();

    this.response.status(status).json({
      status_code: status,
      message,
      timestamp,
    });
  }

  handlerGeneralException(exception: unknown): void {
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string =
      exception instanceof HttpException
        ? exception.message
        : 'Ocorreu um erro desconhecido. Por favor contate o administrador do sistema.';

    try{
      // @ts-ignore
      if(exception.response.data.details[0].message){
        // @ts-ignore
        message = exception.response.data.details[0].message;
      }
    // eslint-disable-next-line no-empty
    } catch {}

    const timestamp: string = new Date().toISOString();

    this.response.status(status).json({
      statusCode: status,
      timestamp,
      message,
      path: this.request.url,
    });
  }
}
