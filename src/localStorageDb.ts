export class LocalStorageDb {
    static #instance: LocalStorageDb;

    private constructor() {}

    public static get instance(): LocalStorageDb {
        if (!LocalStorageDb.#instance) {
            LocalStorageDb.#instance = new LocalStorageDb();
        }

        return LocalStorageDb.#instance;
    }

    /**
     * Fetches all records in the model
     * @returns array of records
     */
    public list(modelName: string) {
        const idList = this.getIdList(modelName);
        const records = [];

        idList.forEach((id: string) => {
            const record = this.get(modelName, id);
            if (record) {
                records.push(record);
            }
        });

        return records;
    }

    public find(modelName: string, filter: any, isFindOne = false) {
        const idList = this.getIdList(modelName);
        const filteredRecords = [];

        for (const id of idList) {
            const record = this.get(modelName, id);
            if (record) {
                const keys = Object.keys(filter);

                let match = true;
                for (const key of keys) {
                    if (record[key] != filter[key]) {
                        match = false;
                        break;
                    }
                }

                if (match) {
                    filteredRecords.push(record);

                    if (isFindOne) {
                        break;
                    }
                }
            }
        }
        return filteredRecords;
    }

    /**
     * Fetch a specific record based on ID
     * @param id ID of the record
     * @returns specific record
     */
    public get(modelName: string, id: string) {
        const record = JSON.parse(localStorage.getItem(id) ?? "{}");

        return record.id ? record : null;
    }

    /**
     * Create a new record in the model
     * @param record record to create
     * @returns record created
     */
    public create(modelName: string, record: any) {
        const idList = this.getIdList(modelName);
        idList.push(record.id);

        localStorage.setItem(record.id, JSON.stringify(record));
        this.saveIdList(modelName, idList);

        return record;
    }

    public bulkCreate(modelName: string, records: any[]) {
        const createdRecords = [];
        records.forEach((record) => {
            createdRecords.push(this.create(modelName, record));
        });

        return createdRecords;
    }

    /**
     * Update an existing record based on ID
     * @param id ID of the record
     * @param updateData record to update
     * @returns record updated
     */
    public update(modelName: string, id: string, updateData: any) {
        const recordToUpdate = this.get(modelName, id);

        if (recordToUpdate) {
            Object.assign(recordToUpdate, {
                ...updateData,
            });
            localStorage.setItem(id, JSON.stringify(recordToUpdate));
            return recordToUpdate;
        }

        return null;
    }

    /**
     * Delete a record based on ID
     * @param id ID of the record
     */
    public delete(modelName: string, id: string) {
        const recordToDelete = this.get(modelName, id);

        if (recordToDelete) {
            const idList = this.getIdList(modelName);
            idList.splice(idList.indexOf(id), 1);

            localStorage.removeItem(id);
            this.saveIdList(modelName, idList);

            return true;
        }

        return false;
    }

    /**
     * Soft deletes a record based on ID
     * @param id ID of the record
     */
    public softDelete(modelName: string, id: string) {
        const record = this.get(modelName, id);

        if (record) {
            record.isDeleted = true;

            localStorage.setItem(id, JSON.stringify(record));
            return true;
        }

        return false;
    }

    /**
     * Deletes all records in the model
     */
    public truncate(modelName: string) {
        const idList = this.getIdList(modelName);

        idList.forEach((id: string) => {
            this.delete(modelName, id);
        });
    }

    /**
     * Fetches all ID of model
     * @returns array of ID of model
     */
    private getIdList(modelName: string): Array<string> {
        const idList = localStorage.getItem(
            `localstorage-db-model-${modelName}`
        );
        if (idList) {
            return JSON.parse(idList);
        } else {
            return [];
        }
    }

    /**
     * Save modified list of IDs
     * @param idList modified list of IDs
     */
    private saveIdList(modelName: string, idList: Array<string>) {
        localStorage.setItem(
            `localstorage-db-model-${modelName}`,
            JSON.stringify(idList)
        );
    }
}

export const localStorageDb = LocalStorageDb.instance;
