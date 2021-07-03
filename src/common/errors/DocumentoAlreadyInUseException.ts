import { HttpException, HttpStatus } from '@nestjs/common';

export default class DocumentoAlreadyInUseException extends HttpException {
  constructor(messagem: string) {
    super(messagem, HttpStatus.BAD_REQUEST);
  }
}
