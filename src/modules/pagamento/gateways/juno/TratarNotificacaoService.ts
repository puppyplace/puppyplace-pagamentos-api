import { BadRequestException } from '@nestjs/common';
import { createHmac } from 'crypto';
import { Request } from 'express';
import NotificacaoPagamentoDTO from '@modules/pagamento/dto/NotificacaoPagamentoDTO';

class TratarNotificacaoService {
  execute(request: Request): NotificacaoPagamentoDTO {
    // this.validarAssinatura(request);
    const notificacao = request.body;
    const id_cobranca_gateway = notificacao.data[0].attributes.charge.id;
    return new NotificacaoPagamentoDTO({
      id_cobranca_gateway,
    });
  }

  private validarAssinatura(request: Request) {
    const assinatura = request.get('X-Signature');
    const assinaturaEsperada = this.gerarAssinatura(request);

    if (assinatura !== assinaturaEsperada) {
      throw new BadRequestException('Notificação sem assinatura válida');
    }
  }

  private gerarAssinatura(request: Request) {
    return createHmac('sha256', process.env.JUNO_WEBHOOK_NOTIFICACAO_PAGAMENTOS_SECRET_KEY)
      .update(JSON.stringify(request.body))
      .digest('hex');
  }
}

export default new TratarNotificacaoService();
