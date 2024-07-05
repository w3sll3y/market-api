import { IsArray, IsBoolean, IsString } from "class-validator";
import { List } from "../entities/list.entity";
import { ItemList } from "../models/ItemList";

export class CreateListDto extends List {
  @IsBoolean()
  statuslist: boolean;

  @IsString()
  description: string;

  @IsArray()
  items: Array<ItemList>;

  @IsString()
  receipt?: string;
}
