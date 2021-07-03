import { HttpException, HttpStatus } from '@nestjs/common';

export default class FormaPagamentoInvalidaException extends HttpException {
  constructor(messagem: string) {
    super(messagem, HttpStatus.BAD_REQUEST);
  }
}
