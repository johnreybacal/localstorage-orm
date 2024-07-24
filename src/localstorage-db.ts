import { LocalStorage } from "node-localstorage";
import Schema from "./schema";

if (typeof window === "undefined") {
    global.localStorage = new LocalStorage("./data");
}

export default class LocalStorageDb<T extends Schema> {
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
        const records: T[] = [];

        idList.forEach((id: string) => {
            const record = this.get(id);
            if (record) {
                records.push(record);
            }
        });

        return records;
    }

    /**
     * Fetch a specific record based on ID
     * @param id ID of the record
     * @returns specific record
     */
    public get(id: string): T | undefined {
        const record = JSON.parse(localStorage.getItem(id) ?? "{}") as T;

        return record.id ? record : undefined;
    }

    /**
     * Create a new record in the model
     * @param record record to create
     * @returns record created
     */
    public create(record: T) {
        const idList = this.getIdList();
        idList.push(record.id);

        localStorage.setItem(record.id, JSON.stringify(record));
        this.saveIdList(idList);

        return record;
    }

    public bulkCreate(records: T[]) {
        const createdRecords: T[] = [];
        records.forEach((record) => {
            createdRecords.push(this.create(record));
        });

        return createdRecords;
    }

    /**
     * Update an existing record based on ID
     * @param id ID of the record
     * @param record record to update
     * @returns record updated
     */
    public update(id: string, record: T) {
        localStorage.setItem(id, JSON.stringify(record));

        return record;
    }

    /**
     * Delete a record based on ID
     * @param id ID of the record
     */
    public delete(id: string) {
        const idList = this.getIdList();
        idList.splice(idList.indexOf(id), 1);

        localStorage.removeItem(id);
        this.saveIdList(idList);
    }

    /**
     * Soft deletes a record based on ID
     * @param id ID of the record
     */
    public softDelete(id: string) {
        const record = this.get(id);

        if (record) {
            record.isDeleted = true;

            localStorage.setItem(id, JSON.stringify(record));
        }
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
