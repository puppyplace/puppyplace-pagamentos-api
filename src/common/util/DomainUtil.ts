export default class DomainUtil {
  static getValue(id: number, domain: any[], field = 'value') {
    return domain.filter(item => item.id == id)[0][field];
  }
}
