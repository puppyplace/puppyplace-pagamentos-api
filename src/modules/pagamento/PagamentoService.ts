import FaturaDTO from '@modules/pagamento/dto/FaturaDTO';
import { Injectable } from '@nestjs/common';
import CobrancaGatewayDTO from './dto/CobrancaGatewayDTO';
import PagadorDTO from './dto/PagadorDTO';
import Gateway from './Gateway';

@Injectable()
export default class PagamentoService {
  constructor() {
    if (!process.env.DEFAULT_GATEWAY) {
      throw new Error('Não existe gateway default instalado no sistema');
    }

    const file = process.env.DEFAULT_GATEWAY;
    const folder = file.toLowerCase();

    try {
      const moduleGatway = require(`./gateways/${folder}/${file}`);
      this.gateway = moduleGatway.default;
    } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND') {
        throw Error(`O módulo de pagamento ${file} parametrizado não foi encontrado`);
      }
      throw e;
    }
  }

  private gateway: Gateway;

  async realizarCobranca(fatura: FaturaDTO, pagador: PagadorDTO): Promise<CobrancaGatewayDTO> {
    const cobrancaGatewayDTO = await this.gateway.criarCobranca(fatura, pagador);
    return cobrancaGatewayDTO;
  }
}
