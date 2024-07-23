import { LocalStorage } from "node-localstorage";
import Schema from "./schema";

global.localStorage = new LocalStorage("./data");

export default class LocalStorageCrud<T extends Schema> {
    protected modelName: string;
    private realModelName: string;

    constructor(modelName: string) {
        this.realModelName = modelName;
        this.modelName = `localstorage-crud-model-${modelName}`;
    }

    /**
     * Fetches all records in the model
     * @returns array of records
     */
    public list(): T[] {
        const idList = this.getIdList();
        const data: T[] = [];

        idList.forEach((id: string) => {
            data.push(this.get(id));
        });

        return data;
    }

    /**
     * Fetch a specific record based on ID
     * @param id ID of the record
     * @returns specific record
     */
    public get(id: string): T {
        const json = JSON.parse(localStorage.getItem(id) ?? "{}");

        return Object.keys.length ? json : undefined;
    }

    /**
     * Create a new record in the model
     * @param data record to create
     * @returns record created
     */
    public create(data: T) {
        data.id = crypto.randomUUID();

        const idList = this.getIdList();
        idList.push(data.id);
        this.saveIdList(idList);

        data.createdAt = new Date();
        localStorage.setItem(data.id, JSON.stringify(data));

        return data;
    }

    /**
     * Update an existing record based on ID
     * @param id ID of the record
     * @param data record to update
     * @returns record updated
     */
    public update(id: string, data: T) {
        const dataToUpdate = this.get(id);
        if (!dataToUpdate) {
            throw Error(`${this.realModelName} does not exist`);
        }
        data.updatedAt = new Date();
        localStorage.setItem(id, JSON.stringify(data));

        return data;
    }

    /**
     * Delete a record based on ID
     * @param id ID of the record
     */
    public delete(id: string) {
        const dataToUpdate = this.get(id);
        if (!dataToUpdate) {
            throw Error(`${this.realModelName} does not exist`);
        }

        const idList = this.getIdList();
        idList.splice(idList.indexOf(id), 1);
        this.saveIdList(idList);

        localStorage.removeItem(id);
    }

    /**
     * Deletes all records in the model
     */
    public truncate() {
        const idList = this.getIdList();

        idList.forEach((id: string) => {
            this.delete(id);
        });
    }

    /**
     * Fetches all ID of model
     * @returns array of ID of model
     */
    private getIdList(): Array<string> {
        return JSON.parse(localStorage.getItem(this.modelName) ?? "[]") ?? [];
    }

    /**
     * Save modified list of IDs
     * @param idList modified list of IDs
     */
    private saveIdList(idList: Array<string>) {
        localStorage.setItem(this.modelName, JSON.stringify(idList));
    }
}
