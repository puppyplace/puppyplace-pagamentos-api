import Constantes from '@common/util/Constantes';
import HttpClient from '@common/util/HttpClient';
import tokenService from './Token';

class JunoConstructor {
  private ENDPOINT_CONSULTA_WEBHOOK = `${process.env.JUNO_BASE_URL_API}/notifications/webhooks`;
  private RESOURCE_TOKEN = process.env.JUNO_TOKEN_PRIVADO;
  private EVENTO_NOTIFICACAO_PAGAMENTO = 'PAYMENT_NOTIFICATION';
  private APPLICATION_URL = process.env.APPLICATION_URL;

  async execute() {
    const token = await tokenService.resolveToken();

    const config = {
      headers: {
        'X-Api-Version': 2,
        'X-Resource-Token': this.RESOURCE_TOKEN,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const webhooksToDelete = await HttpClient.get(this.ENDPOINT_CONSULTA_WEBHOOK, config);

    await Promise.all(
      webhooksToDelete.data._embedded.webhooks.map(w => {
        return HttpClient.delete(`${this.ENDPOINT_CONSULTA_WEBHOOK}/${w.id}`, config);
      }),
    );

    const webhookCreated = await HttpClient.post(
      this.ENDPOINT_CONSULTA_WEBHOOK,
      JSON.stringify({
        url: `${this.APPLICATION_URL}/${Constantes.ENDPOINT_CALLBACK_PAGAMENTOS}`,
        eventTypes: [this.EVENTO_NOTIFICACAO_PAGAMENTO],
      }),
      config,
    );

    process.env.JUNO_WEBHOOK_NOTIFICACAO_PAGAMENTOS_SECRET_KEY = webhookCreated.data.secret;
  }
}
export default new JunoConstructor();
