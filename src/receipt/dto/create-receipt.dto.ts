import { IsString } from "class-validator";
import { Receipt } from "../entities/receipt.entity";

export class CreateReceiptDto extends Receipt {
  @IsString()
  image: string;

  @IsString()
  description: string;
}
