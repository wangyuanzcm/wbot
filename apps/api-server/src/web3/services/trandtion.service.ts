import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions } from 'mongoose';

import { CreateTrandtionDto } from '../dto/create-Trandtion.dto';
import { Trandtion } from '../schemas/Trandtion.schema';

export interface FindAllParamsType {
  query: Record<string, unknown>;
  pageNumber: number; // 页码，从1开始
  pageSize: number; // 每页的数量
  options: QueryOptions;
}

@Injectable()
export class TrandtionService {
  constructor(
    @InjectModel(Trandtion.name)
    private readonly TrandtionModel: Model<Trandtion>,
  ) {}

  async create(
    createTrandtionDto: CreateTrandtionDto,
  ): Promise<Trandtion> {
    const createdTrandtion = await this.TrandtionModel.create(
      createTrandtionDto,
    );
    return createdTrandtion;
  }

  async findAll(
    params: FindAllParamsType,
  ): Promise<{ count: number; details: Trandtion[] }> {
    const { query = {}, pageNumber = 1, pageSize = 10, options = {} } = params;
    const countPromise = this.TrandtionModel.countDocuments(query).exec();
    const findPromise = this.TrandtionModel.find(query, null, options)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .exec();
    return Promise.all([countPromise, findPromise]).then(
      ([count, results]: [number, Trandtion[]]) => ({
        count,
        details: results,
      }),
    );
  }

  async findOne(id: string): Promise<Trandtion> {
    return this.TrandtionModel.findOne({ _id: id }).exec();
  }

  async getSymbolTypes(): Promise<string[]> {
    return this.TrandtionModel.distinct('Symbol');
  }
}
