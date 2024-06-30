import { IsBoolean } from "class-validator";
import { List } from "../entities/list.entity";

export class CreateListDto extends List {
  @IsBoolean()
  statuslist: boolean;
}
