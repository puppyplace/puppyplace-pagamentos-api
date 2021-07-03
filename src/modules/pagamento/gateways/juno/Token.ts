import { addSeconds, isBefore } from 'date-fns';
import httpClient from '@common/util/HttpClient';

class Token {
  private BASE_URL = `${process.env.JUNO_BASE_URL_AUTH}/oauth/token`;
  private JUNO_CLIENT_ID = process.env.JUNO_CLIENT_ID;
  private JUNO_CLIENT_SECRET = process.env.JUNO_CLIENT_SECRET;
  private TOKEN_JUNO;
  private VENCIMENTO_TOKEN_JUNO: Date;

  async resolveToken() {
    if (!this.VENCIMENTO_TOKEN_JUNO || isBefore(this.VENCIMENTO_TOKEN_JUNO, new Date())) {
      await this.generateToken();
    }

    return this.TOKEN_JUNO;
  }

  private async generateToken() {
    try {
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');

      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${this.JUNO_CLIENT_ID}:${this.JUNO_CLIENT_SECRET}`).toString('base64')}`,
        },
      };
      const tokenResponse = await httpClient.post(this.BASE_URL, params, config);

      this.TOKEN_JUNO = tokenResponse.data.access_token;
      this.VENCIMENTO_TOKEN_JUNO = addSeconds(new Date(), tokenResponse.data.expires_in);
    } catch (e) {
      // TODO: implementar nova tentativa
      console.log(e);
      throw e;
    }
  }
}

export default new Token();
