import AddressDTO from './AddressDTO';
export default class CriarCobrancaRequest {
  constructor() {
    this.charge = new ChargeDTO();
    this.billing = new BillingDTO();
  }
  charge: ChargeDTO;
  billing: BillingDTO;
}

class ChargeDTO {
  constructor() {
    this.references = [];
    this.paymentTypes = [];
  }
  pixKey: string;
  description: string;
  references: string[];
  amount: number;
  totalAmount: number;
  dueDate: string;
  installments: number;
  maxOverdueDays: number;
  paymentTypes: string[];
  paymentAdvance: boolean;
}
class BillingDTO {
  constructor() {
    this.address = new AddressDTO();
  }
  name: string;
  document: string;
  email: string;
  address: AddressDTO;
  secondaryEmail: string;
  phone: string;
  birthDate: string;
  notify: boolean;
}
