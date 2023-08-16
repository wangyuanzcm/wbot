import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions } from 'mongoose';

import { CreateTokenBalanceDto } from '../dto/create-tokenbalance.dto';
import { TokenBalance } from '../schemas/tokenbalance.schema';

export interface FindAllParamsType {
  query: Record<string, unknown>;
  pageNumber: number; // 页码，从1开始
  pageSize: number; // 每页的数量
  options: QueryOptions;
}

@Injectable()
export class TokenBalanceService {
  constructor(
    @InjectModel(TokenBalance.name)
    private readonly TokenBalanceModel: Model<TokenBalance>,
  ) {}

  async create(
    createTokenBalanceDto: CreateTokenBalanceDto,
  ): Promise<TokenBalance> {
    const createdTokenBalance = await this.TokenBalanceModel.create(
      createTokenBalanceDto,
    );
    return createdTokenBalance;
  }

  async findAll(
    params: FindAllParamsType,
  ): Promise<{ count: number; details: TokenBalance[] }> {
    const { query = {}, pageNumber = 1, pageSize = 10, options = {} } = params;
    const countPromise = this.TokenBalanceModel.countDocuments(query).exec();
    const findPromise = this.TokenBalanceModel.find(query, null, options)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .exec();
    return Promise.all([countPromise, findPromise]).then(
      ([count, results]: [number, TokenBalance[]]) => ({
        count,
        details: results,
      }),
    );
  }

  async findOne(id: string): Promise<TokenBalance> {
    return this.TokenBalanceModel.findOne({ _id: id }).exec();
  }

  async getSymbolTypes(): Promise<string[]> {
    return this.TokenBalanceModel.distinct('Symbol');
  }
}
