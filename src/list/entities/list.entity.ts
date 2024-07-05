import { ItemList } from "../models/ItemList";

export class List {
  id?: string;
  createdat?: Date;
  description: string;
  items: ItemList[];
  statuslist: boolean;
  receipt?: string;
  createdby: string;
}
