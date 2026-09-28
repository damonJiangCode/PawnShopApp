import type { Item } from "../models/item.model.ts";
import type {
  ItemCategoryOption,
  ItemFormField,
  ItemSearchInput,
  ItemSearchResult,
  SaveItemInput,
} from "../payload-contracts/item.contract.ts";

export type ItemOperationResult<T> =
  | { ok: true; result: T }
  | { ok: false; field: ItemFormField; message: string };

export type ItemApi = {
  loadItemsByTicket: (ticketNumber: number) => Promise<Item[]>;
  loadItemsByClient: (clientNumber: number) => Promise<Item[]>;
  loadItemCategories: () => Promise<ItemCategoryOption[]>;
  searchItems: (
    input: ItemSearchInput,
  ) => Promise<ItemOperationResult<ItemSearchResult>>;
  createItem: (input: SaveItemInput) => Promise<ItemOperationResult<Item>>;
  updateItem: (input: SaveItemInput) => Promise<ItemOperationResult<Item>>;
  deleteItem: (
    ticketNumber: number,
    itemNumber: number,
  ) => Promise<ItemOperationResult<null>>;
  linkItemsToTicket: (
    ticketNumber: number,
    itemNumbers: number[],
  ) => Promise<ItemOperationResult<Item[]>>;
  saveItemImage: (fileName: string, base64: string) => Promise<string>;
};
