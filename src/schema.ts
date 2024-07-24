import LocalStorageDb from "./localstorage-db";
import ModelSettings from "./modelSettings";

export default interface Schema {
    /**
     * Unique identifier for the record
     */
    id: string;
    /**
     * Timestamp when the record was created
     */
    createdAt: Date;
    /**
     * Timestamp when the record was last updated
     */
    updatedAt: Date;
    /**
     * Flag if the record is deleted (in a soft delete model)
     */
    isDeleted: boolean;

    /**
     * Save this instance
     * @returns the saved instance
     */
    save(): Schema;
    /**
     * Delete this instance
     */
    delete();
}

export interface SchemasI<T extends Schema> extends Array<T> {
    /**
     * Save all records in this array
     */
    save();
    /**
     * Deletes all records in this array
     */
    delete();
}

export class Schemas<T extends Schema> extends Array<T> implements SchemasI<T> {
    private localStorageCrud: LocalStorageDb<T>;
    private modelSettings: ModelSettings;
    constructor(
        localStorageCrud: LocalStorageDb<T>,
        modelSettings: ModelSettings
    ) {
        super();
        this.localStorageCrud = localStorageCrud;
        this.modelSettings = modelSettings;
    }
    save() {
        this.forEach((record) => {
            if (record.id) {
                // TODO timestamp
                this.localStorageCrud.update(record.id, record);
            } else {
                // TODO timestamp
                record.id = crypto.randomUUID();
                this.localStorageCrud.create(record);
            }
        });
    }
    delete() {
        this.forEach((record) => {
            if (this.modelSettings.softDelete) {
                this.localStorageCrud.softDelete(record.id);
            } else {
                this.localStorageCrud.delete(record.id);
            }
        });
    }
}
