import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TokenBalanceDocument = HydratedDocument<TokenBalance>;

@Schema()
export class TokenBalance {
  @Prop()
  created_time: number;

  @Prop()
  totaleth: string;

  @Prop()
  totalusd: string;
  @Prop()
  total: string;
  @Prop()
  pic: string;
  @Prop()
  TokenName: string;
  @Prop()
  TokenHash: string;
  @Prop()
  Symbol: string;
  @Prop()
  Quantity: string;
  @Prop()
  TokenPrice: string;
  @Prop()
  Change24h: string;
  @Prop()
  ValueIInBnB: string;
  @Prop()
  ValueInUSD: string;
  @Prop()
  walletAddress: string;
}

export const TokenBalanceSchema = SchemaFactory.createForClass(TokenBalance);
