import estadosDomain from '@common/domain/estados.json';
import { FormaPagamento } from '@common/enum/FormaPagamento';
import { StatusCobranca } from '@common/enum/StatusCobranca';
import FormaPagamentoInvalidaException from '@common/errors/FormaPagamentoInvalidaException';
import DomainUtil from '@common/util/DomainUtil';
import httpClient from '@common/util/HttpClient';
import CobrancaGatewayDTO from '@modules/pagamento/dto/CobrancaGatewayDTO';
import FaturaDTO from '@modules/pagamento/dto/FaturaDTO';
import PagadorDTO from '@modules/pagamento/dto/PagadorDTO';
import { addDays, format, parseISO } from 'date-fns';
import CriarCobrancaRequest from './dto/CriarCobrancaRequest';
import CriarCobrancaResponse from './dto/CriarCobrancaResponse';
import { StatusPagamentoJuno } from './enum/StatusPagamentoJuno';
import tokenService from './Token';

class CriarCobrancaJunoService {
  private CHAVE_PIX = process.env.JUNO_PIX_KEY;
  private ENDPOINT_CRIACAO_COBRANCA = `${process.env.JUNO_BASE_URL_API}/charges`;
  private RESOURCE_TOKEN = process.env.JUNO_TOKEN_PRIVADO;
  private fatura: FaturaDTO;
  private pagador: PagadorDTO;

  private factoryMethod = {
    [FormaPagamento.BOLETO]: () => this.gerarBoleto(),
    [FormaPagamento.CARTAO_CREDITO]: () => this.gerarCobrancaCartao(),
  };

  async execute(fatura: FaturaDTO, pagador: PagadorDTO): Promise<CobrancaGatewayDTO> {
    let cobrancaGatewayDTO: CobrancaGatewayDTO;
    this.fatura = fatura;
    this.pagador = pagador;

    if (this.factoryMethod[fatura.forma_pagamento]) {
      cobrancaGatewayDTO = await this.factoryMethod[fatura.forma_pagamento]();
    } else {
      throw new FormaPagamentoInvalidaException('Não foi selecionado uma forma de pagamento válida');
    }

    return cobrancaGatewayDTO;
  }

  private async gerarBoleto() {
    const request = new CriarCobrancaRequest();

    request.charge.pixKey = this.CHAVE_PIX;
    request.charge.description = this.gerarDescricao();
    request.charge.references.push(this.gerarDescricao());
    request.charge.amount = this.fatura.valor_total;
    request.charge.dueDate = format(addDays(new Date(), 3), 'yyyy-MM-dd');
    request.charge.installments = 1;
    request.charge.maxOverdueDays = 0;
    request.charge.paymentTypes.push('BOLETO_PIX');
    request.charge.paymentAdvance = false;

    const response = await this.finalizarCobranca(request);
    return this.buildCobrancaGatewayDTO(response);
  }

  private async gerarCobrancaCartao() {
    const request = new CriarCobrancaRequest();
    request.charge.description = this.gerarDescricao();

    for (let i = 0; i < this.fatura.parcelamento; i++) {
      request.charge.references.push(`${i}ª Parcela - ${this.gerarDescricao()}`);
    }

    if (this.fatura.parcelamento === 1) {
      request.charge.amount = this.fatura.valor_total;
    } else {
      request.charge.totalAmount = this.fatura.valor_total;
    }

    request.charge.dueDate = format(addDays(new Date(), 3), 'yyyy-MM-dd');
    request.charge.installments = this.fatura.parcelamento;
    request.charge.maxOverdueDays = 0;
    request.charge.paymentTypes.push('CREDIT_CARD');
    request.charge.paymentAdvance = false;

    const response = await this.finalizarCobranca(request);
    return this.buildCobrancaGatewayDTO(response);
  }

  private buildCobrancaGatewayDTO(response: CriarCobrancaResponse) {
    const id_cobranca_gateway = response._embedded.charges.map(c => c.id);

    const charge = response._embedded.charges[0];
    const status =
      response._embedded.charges[0].status === StatusPagamentoJuno.PAID ? StatusCobranca.PAGO : StatusCobranca.ABERTO;
    const cobranca_paga = status === StatusCobranca.PAGO;
    const link_finalizar_pagamento = status === StatusCobranca.PAGO ? null : charge.checkoutUrl;
    const proxima_url = this.fatura.forma_pagamento === FormaPagamento.BOLETO ? charge.link : link_finalizar_pagamento;

    return new CobrancaGatewayDTO({
      id_cobranca_gateway,
      vencimento: charge.dueDate,
      status,
      gateway: 'Juno',
      proxima_url,
      cobranca_paga,
    });
  }

  private gerarDescricao(): string {
    return `Cobrança PuppyPlace #${this.fatura.numero_pedido}`;
  }

  async finalizarCobranca(request: CriarCobrancaRequest): Promise<CriarCobrancaResponse> {
    request.billing.name = this.pagador.nome;
    request.billing.document = this.pagador.cpf_cnpj;
    request.billing.email = this.pagador.email;
    request.billing.address.street = this.pagador.endereco.logradouro;
    request.billing.address.number = `${this.pagador.endereco.numero}`;
    request.billing.address.complement = this.pagador.endereco.complemento;
    request.billing.address.neighborhood = this.pagador.endereco.bairro;
    request.billing.address.city = this.pagador.endereco.cidade;
    request.billing.address.state = this.pagador.endereco.uf;
    request.billing.address.postCode = this.pagador.endereco.cep;
    request.billing.secondaryEmail = this.pagador.email_secundario;
    request.billing.phone = this.pagador.telefone_principal;
    request.billing.birthDate = format(parseISO(this.pagador.data_nascimento.toString()), 'yyyy-MM-dd');
    request.billing.notify = false;

    const token = await tokenService.resolveToken();

    const cobrancaResponse = await httpClient.post(this.ENDPOINT_CRIACAO_COBRANCA, JSON.stringify(request), {
      headers: {
        'X-Api-Version': 2,
        'X-Resource-Token': this.RESOURCE_TOKEN,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return cobrancaResponse.data;
  }
}
export default new CriarCobrancaJunoService();
