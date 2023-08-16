import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Web3Controller } from './web3.controller';
import { TokenBalanceService } from './services/tokenbalance.service';
import {
  TokenBalance,
  TokenBalanceSchema,
} from './schemas/tokenbalance.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TokenBalance.name, schema: TokenBalanceSchema },
    ]),
  ],
  controllers: [Web3Controller],
  providers: [TokenBalanceService],
})
export class Web3Module {}
