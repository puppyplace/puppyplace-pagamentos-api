import { Module } from '@nestjs/common';
import PagamentoController from './PagamentoController';
import PagamentoService from './PagamentoService';

@Module({
  controllers: [PagamentoController],
  providers: [PagamentoService],
  exports: [PagamentoService],
})
export default class PagamentoModule {}
