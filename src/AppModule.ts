import PagamentoModule from '@modules/pagamento/PagamentoModule';
import { Module } from '@nestjs/common';

@Module({
  imports: [PagamentoModule],
})
export class AppModule {}
