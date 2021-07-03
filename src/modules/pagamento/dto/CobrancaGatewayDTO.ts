import { StatusCobranca } from '@common/enum/StatusCobranca';

export default class CobrancaGatewayDTO {
  constructor(init?: Partial<CobrancaGatewayDTO>) {
    Object.assign(this, init);
  }

  id_cobranca_gateway: string[];
  vencimento: Date;
  status: StatusCobranca;
  gateway: string;
  proxima_url: string;
  cobranca_paga: boolean;
}
