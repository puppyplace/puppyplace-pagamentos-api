export default class Validator {
  static CPF(strCPF: string): boolean {
    if (strCPF === '00000000000') return false;
    if (strCPF === '11111111111') return false;
    if (strCPF === '22222222222') return false;
    if (strCPF === '33333333333') return false;
    if (strCPF === '44444444444') return false;
    if (strCPF === '55555555555') return false;
    if (strCPF === '66666666666') return false;
    if (strCPF === '77777777777') return false;
    if (strCPF === '88888888888') return false;
    if (strCPF === '99999999999') return false;

    let soma = 0;
    let resto: number;

    for (let i = 1; i <= 9; i++) soma += parseInt(strCPF.substring(i - 1, i), 10) * (11 - i);
    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(strCPF.substring(9, 10), 10)) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(strCPF.substring(i - 1, i), 10) * (12 - i);
    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(strCPF.substring(10, 11), 10)) return false;
    return true;
  }
}
