export default class NotificacaoPagamentoDTO {
  constructor(init?: Partial<NotificacaoPagamentoDTO>) {
    Object.assign(this, init);
    this.data_hora_notificacao = new Date();
  }

  id_cobranca_gateway: string;
  data_hora_notificacao: Date;
}
