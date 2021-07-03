
import { Sexo } from '@common/enum/Sexo';
import EnderecoDTO from './EnderecoDTO';

export default class PagadorDTO {
  nome: string;
  cpf_cnpj: string;
  endereco: EnderecoDTO;
  email: string;
  email_secundario: string;
  telefone_principal: string;
  data_nascimento: Date;
  sexo: Sexo;
}
