import { HttpException, HttpStatus } from '@nestjs/common';

export default class RecursoAlreadyExistsException extends HttpException {
  private id_entidade: string;

  constructor(messagem: string, id = '', status = HttpStatus.BAD_REQUEST) {
    super(messagem, status);
    this.id_entidade = id;
  }

  getIdEntidadeFound(): string {
    return this.id_entidade;
  }
}
