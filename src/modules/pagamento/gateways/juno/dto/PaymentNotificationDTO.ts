import { StatusPagamentoJuno } from '../enum/StatusPagamentoJuno';
import AddressDTO from './AddressDTO';

export default class PaymentNotificationDTO {
  eventId: string;
  eventType: string;
  timestamp: Date;
  data: DataPaymentNotificationDTO[];
}

class DataPaymentNotificationDTO {
  entityId: string;
  entityType: string;
  attributes: AttributesDataPaymentNotificationDTO;
}

class AttributesDataPaymentNotificationDTO {
  createdOn: Date;
  date: Date;
  releaseDate: Date;
  amount: string;
  fee: string;
  status: string;
  type: string;
  charge: ChargeNotificationDTO;
  digitalAccountId: string;
}

class ChargeNotificationDTO {
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
  payer: Payer;
}

class Payer {
  name: string;
  document: string;
  address: AddressDTO;
}
