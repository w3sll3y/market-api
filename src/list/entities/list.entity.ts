import { ItemList } from "../models/ItemList";

export class List {
  id?: string;
  createdat?: string;
  description?: string;
  items?: ItemList[];
  statuslist: boolean;
  receipt?: string;
}
