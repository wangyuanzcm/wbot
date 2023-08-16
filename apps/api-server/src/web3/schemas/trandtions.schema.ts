import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TrandtionDocument = HydratedDocument<Trandtion>;

@Schema()
export class Trandtion {
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

export const TrandtionSchema = SchemaFactory.createForClass(Trandtion);
