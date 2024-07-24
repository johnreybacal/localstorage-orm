import LocalStorageDb from "./localstorage-db";
import ModelSettings from "./modelSettings";
import Schema, { Schemas } from "./schema";

export default class Model<T extends Schema> {
    protected modelName: string;
    private localStorageCrud: LocalStorageDb<T>;
    private modelSettings: ModelSettings;

    /**
     * Create a new model
     */
    constructor(modelName: string, modelSettings?: ModelSettings) {
        this.modelName = modelName;
        this.localStorageCrud = new LocalStorageDb<T>(this.modelName);

        this.modelSettings = modelSettings ?? {
            timestamps: false,
            softDelete: false,
        };
    }

    /**
     * Creates a new instance of the model
     */
    build(instance?: Omit<T, keyof Schema>): T;

    /**
     * Creates a list of instances of the model
     */
    build(instances: Omit<T, keyof Schema>[]): Schemas<T>;

    /**
     * Overloading implementation
     */
    build(
        param?: Omit<T, keyof Schema> | Omit<T, keyof Schema>[]
    ): T | Schemas<T> {
        if (param && Array.isArray(param)) {
            const builtInstances: Schemas<T> = new Schemas<T>(
                this.localStorageCrud,
                this.modelSettings
            );

            param.forEach((p) => {
                builtInstances.push(this.#build(p));
            });

            return builtInstances;
        } else {
            return this.#build(param);
        }
    }

    /**
     * Creates a new instance of the model
     */
    #build(instance?: Omit<T, keyof Schema>): T {
        if (!instance) {
            instance = {} as T;
        }
        const instanceOfSchema = instance as T;

        instanceOfSchema.save = () => {
            if (instanceOfSchema.id) {
                this.setUpdateTimestamp(instanceOfSchema);

                return this.localStorageCrud.update(
                    instanceOfSchema.id,
                    instanceOfSchema
                );
            } else {
                this.setCreateTimestamp(instanceOfSchema);
                instanceOfSchema.id = crypto.randomUUID();

                return this.localStorageCrud.create(instanceOfSchema);
            }
        };
        instanceOfSchema.delete = () => {
            if (this.modelSettings.softDelete) {
                this.localStorageCrud.softDelete(instanceOfSchema.id);
            } else {
                this.localStorageCrud.delete(instanceOfSchema.id);
            }
        };

        return instanceOfSchema;
    }

    /**
     * Fetches all records in the model
     * @returns array of records
     */
    list() {
        return this.build(this.localStorageCrud.list());
    }

    /**
     * Fetch a specific record based on ID
     * @param id ID of the record
     * @returns specific record
     */
    get(id: string) {
        return this.#build(this.localStorageCrud.get(id));
    }

    /**
     * Create a new record in the model
     * @param record record to create
     * @returns record created
     */
    create(record: Omit<T, keyof Schema>): T;

    /**
     * Bulk insert a list of records
     * @param records list to bulk create
     * @returns records created
     */
    create(records: Omit<T, keyof Schema>[]): T[];

    /**
     * Overloading implementation
     */
    create(param: Omit<T, keyof Schema> | Omit<T, keyof Schema>[]): T | T[] {
        if (Array.isArray(param)) {
            const instanceRecords = param as T[];
            instanceRecords.forEach((record) => {
                record.id = crypto.randomUUID();
                this.setCreateTimestamp(record);
            });
            return this.localStorageCrud.bulkCreate(instanceRecords);
        } else {
            const instanceRecord = param as T;
            this.setCreateTimestamp(instanceRecord);
            instanceRecord.id = crypto.randomUUID();

            return this.build(this.localStorageCrud.create(instanceRecord));
        }
    }

    /**
     * Update an existing record based on ID
     * @param id ID of the record
     * @param record record to update
     * @returns record updated
     */
    update(id: string, record: T) {
        this.setUpdateTimestamp(record);
        return this.build(this.localStorageCrud.update(id, record));
    }

    /**
     * Delete a record based on ID
     * @param id ID of the record
     */
    delete(id: string) {
        if (this.modelSettings.softDelete) {
            this.localStorageCrud.softDelete(id);
        } else {
            this.localStorageCrud.delete(id);
        }
    }

    /**
     * Deletes all records in the model
     */
    truncate() {
        this.localStorageCrud.truncate();
    }

    private setCreateTimestamp(record: T) {
        if (this.modelSettings.timestamps) {
            record.createdAt = new Date();
        }
    }
    private setUpdateTimestamp(record: T) {
        if (this.modelSettings.timestamps) {
            record.updatedAt = new Date();
        }
    }
}
