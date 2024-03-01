import { Item } from "../Item";

export interface IRepository {
    init(): Promise<void>;
    getAllItems(): Promise<Item[]>;
}