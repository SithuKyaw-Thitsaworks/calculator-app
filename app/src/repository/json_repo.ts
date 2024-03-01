import { Item } from "../types/Item";
import fs from "fs";
import { UnableToInitializeCalculatorError } from "../types/errors";
import { IRepository } from "../types/interfaces/IRepository";

export class JsonRepo implements IRepository {
    private _items: Item[] = [];
    private _database_file_path: string = "";

    constructor(database_file_path: string) {
        this._database_file_path = database_file_path;
        this.init();
    }

    async init(): Promise<void> {
        try {
            const rawData = fs.readFileSync(this._database_file_path, 'utf-8');
            this._items = JSON.parse(rawData);
        }
        catch (error: any) {
            console.log(error);
            throw new UnableToInitializeCalculatorError("Unable to initialize the database.");
        }
    }

    async getAllItems(): Promise<Item[]> {
        return this._items;
    }
}