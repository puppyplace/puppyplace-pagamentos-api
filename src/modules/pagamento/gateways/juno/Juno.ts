import CobrancaGatewayDTO from '@modules/pagamento/dto/CobrancaGatewayDTO';
import FaturaDTO from '@modules/pagamento/dto/FaturaDTO';
import PagadorDTO from '@modules/pagamento/dto/PagadorDTO';
import Gateway from '@modules/pagamento/Gateway';
import criarCobrancaJunoService from './CriarCobrancaJunoService';
import junoConstructor from './JunoConstructor';

class Juno implements Gateway {
  private ENVIRONMENT = process.env.NODE_ENV;

  constructor() {
    if (this.ENVIRONMENT === 'development') {
      console.log('Assinatura de webhooks juno não será construída em modo de desenvolvimento');
    } else {
      this.init()
        .then(() => console.log('Webhook juno assinado com sucesso'))
        .catch(e => {
          throw e;
        });
    }
  }

  private async init() {
    await junoConstructor.execute();
  }

  async criarCobranca(faturaDTO: FaturaDTO, pagadorDTO: PagadorDTO): Promise<CobrancaGatewayDTO> {
    return criarCobrancaJunoService.execute(faturaDTO, pagadorDTO);
  }
}

export default new Juno();
