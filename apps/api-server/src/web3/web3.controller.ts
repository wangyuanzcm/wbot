import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { QueryOptions } from 'mongoose';

import { TokenBalanceService } from './services/tokenbalance.service';
import { CreateTokenBalanceDto } from './dto/create-tokenbalance.dto';
import { TokenBalance } from './schemas/tokenbalance.schema';

@Controller({
  path: 'web3',
  version: [VERSION_NEUTRAL, '1'],
})
export class Web3Controller {
  constructor(private readonly tokenBalanceService: TokenBalanceService) {}
  /**
   * 创建一条数据
   * @param createTokenBalanceDto
   */
  @Post('/token-balance/create')
  async create(@Body() createTokenBalanceDto: CreateTokenBalanceDto) {
    await this.tokenBalanceService.create(createTokenBalanceDto);
  }

  /**
   * 根据参数获取全部的数据信息
   */
  @Post('/token-balance/query/')
  async findAll(
    @Body()
    params: {
      query: Record<string, unknown>;
      pageNumber: number; // 页码，从1开始
      pageSize: number; // 每页的数量
      options: QueryOptions;
    },
  ): Promise<{ count: number; details: TokenBalance[] }> {
    return this.tokenBalanceService.findAll(params);
  }
  /**
   * 获取symbol所有的类型
   */
  @Get('/token-balance/query/symbol-types')
  async getSymbolTypes(): Promise<string[]> {
    return this.tokenBalanceService.getSymbolTypes();
  }
  /**
   * 根据id获取指定的数据
   */
  @Get('/token-balance/query/:id')
  async findOne(@Param('id') id: string): Promise<TokenBalance> {
    return this.tokenBalanceService.findOne(id);
  }
}
