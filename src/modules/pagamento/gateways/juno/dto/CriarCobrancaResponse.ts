import { StatusPagamentoJuno } from '../enum/StatusPagamentoJuno';

export default class CriarCobrancaResponse {
  '_embedded': EmbeddedResponseDTO;
}

class EmbeddedResponseDTO {
  charges: ChargeResponseDTO[];
}

class ChargeResponseDTO {
  id: string;
  code: number;
  reference: string;
  dueDate: Date;
  link: string;
  checkoutUrl: string;
  installmentLink: string;
  payNumber: string;
  amount: number;
  status: StatusPagamentoJuno;
  billetDetails: BilletDetailsDTO;
}

class BilletDetailsDTO {
  bankAccount: string;
  ourNumber: string;
  barcodeNumber: string;
  portfolio: string;
}
