import Fatura from '@modules/pagamento/dto/FaturaDTO';
import CobrancaGatewayDTO from './dto/CobrancaGatewayDTO';
import PagadorDTO from './dto/PagadorDTO';

export default interface Gateway {
  criarCobranca(fatura: Fatura, pagador: PagadorDTO): Promise<CobrancaGatewayDTO>;
}
