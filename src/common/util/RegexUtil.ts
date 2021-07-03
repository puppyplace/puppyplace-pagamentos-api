export default class RegexUtil {
  static CEP = /[0-9]{2}.?[0-9]{3}-?[0-9]{3}/;

  static TELEFONE = /\(?[0-9]{2}\)?\s?(9-)?[0-9]{4}-?[0-9]{4}/;

  static CPF = /[0-9]{3}.?[0-9]{3}.?[0-9]{3}-?[0-9]{2}/;
}
