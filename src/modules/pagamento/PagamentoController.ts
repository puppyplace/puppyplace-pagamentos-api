import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import CobrancaDTO from "./dto/CobrancaDTO";
import CobrancaGatewayDTO from "./dto/CobrancaGatewayDTO";
import PagamentoService from "./PagamentoService";

@Controller('v1/pagamento')
export default class PagamentoController {
    constructor(private readonly pagamentoService: PagamentoService) {}

    @Post()
    @HttpCode(201)
    async realizarCobranca(@Body() cobrancaDTO : CobrancaDTO): Promise<CobrancaGatewayDTO> {
        const cobrancaGatewayDTO = await this.pagamentoService.realizarCobranca(cobrancaDTO.fatura, cobrancaDTO.pagador);
        return cobrancaGatewayDTO;
    }
}