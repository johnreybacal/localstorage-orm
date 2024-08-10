import InstanceMethods from "./instanceMethods";
import Instances from "./instances";
import { localStorageDb } from "./localStorageDb";
import ModelManager from "./modelManager";
import ModelSettings from "./modelSettings";
import Schema from "./schema";

export default class Model<T extends Schema> {
    readonly modelName: string;
    readonly modelSettings: ModelSettings;
    private instanceMethods: InstanceMethods<T>;

    /**
     * Create a new model
     */
    constructor(modelName: string, modelSettings?: ModelSettings) {
        this.modelName = modelName;

        ModelManager.addModel(this);

        this.modelSettings = modelSettings ?? {
            timestamps: false,
            softDelete: false,
        };

        this.instanceMethods = new InstanceMethods<T>(
            this.modelName,
            this.modelSettings
        );
    }

    /**
     * Creates a new instance of the model
     */
    build(instance?: Omit<T, keyof Schema>): T;

    /**
     * Creates a list of instances of the model
     */
    build(instances: Omit<T, keyof Schema>[]): Instances<T>;

    /**
     * Overloading implementation
     */
    build(
        params?: Omit<T, keyof Schema> | Omit<T, keyof Schema>[]
    ): T | Instances<T> {
        if (params && Array.isArray(params)) {
            const builtInstances: Instances<T> = new Instances<T>();

            params.forEach((param) => {
                builtInstances.push(this.instanceMethods.build(param));
            });

            return builtInstances;
        } else {
            return this.instanceMethods.build(params as Omit<T, keyof Schema>);
        }
    }

    /**
     * Fetches all records in the model
     * @returns array of records
     */
    list() {
        return this.build(localStorageDb.list(this.modelName));
    }

    /**
     * Fetches record/s based on the given filter
     */
    find(filter: Partial<T>) {
        return this.build(localStorageDb.find(this.modelName, filter));
    }

    /**
     * Fetches a single record based on the given filter
     */
    findOne(filter: Partial<T>) {
        const filtered = localStorageDb.find(this.modelName, filter, true);
        if (filtered.length > 0) {
            return this.build(filtered[0]);
        } else {
            return null;
        }
    }

    /**
     * Update records that matches with the find filter
     */
    findAndUpdate(
        filter: Partial<T>,
        updateData: Partial<Omit<T, keyof Schema>>
    ) {
        const records: Instances<T> = this.build(
            localStorageDb.find(this.modelName, filter)
        );
        records.map((record: T) => {
            this.setUpdateTimestamp(record);
            Object.assign(record, updateData);
        });

        records.save();

        return records;
    }

    /**
     * Fetch a specific record based on ID
     * @param id ID of the record
     * @returns specific record
     */
    findById(id: string) {
        return this.get(id);
    }

    /**
     * Update an existing record based on ID
     * @param id ID of the record
     * @param record record to update
     * @returns record updated
     */
    findByIdAndUpdate(id: string, updateData: Partial<Omit<T, keyof Schema>>) {
        return this.update(id, updateData);
    }

    /**
     * Fetch a specific record based on ID
     * @param id ID of the record
     * @returns specific record
     */
    get(id: string) {
        const record = localStorageDb.get(this.modelName, id);
        if (record) {
            return this.build(localStorageDb.get(this.modelName, id));
        } else {
            return null;
        }
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
    create(records: Omit<T, keyof Schema>[]): Instances<T>;

    /**
     * Overloading implementation
     */
    create(
        param: Omit<T, keyof Schema> | Omit<T, keyof Schema>[]
    ): T | Instances<T> {
        if (Array.isArray(param)) {
            const instanceRecords = param as T[];
            instanceRecords.forEach((record) => {
                record.id = crypto.randomUUID();
                this.setCreateTimestamp(record);
            });
            return this.build(
                localStorageDb.bulkCreate(this.modelName, instanceRecords)
            );
        } else {
            const instanceRecord = param as T;
            this.setCreateTimestamp(instanceRecord);
            instanceRecord.id = crypto.randomUUID();

            return this.build(
                localStorageDb.create(this.modelName, instanceRecord)
            );
        }
    }

    /**
     * Update an existing record based on ID
     * @param id ID of the record
     * @param record record to update
     * @returns record updated
     */
    update(id: string, record: Partial<Omit<T, keyof Schema>>) {
        this.setUpdateTimestamp(record as T);
        const updatedData = localStorageDb.update(
            this.modelName,
            id,
            record as T
        );

        if (updatedData) {
            return this.build(updatedData);
        }

        return null;
    }

    /**
     * Delete a record based on ID
     * @param id ID of the record
     */
    delete(id: string) {
        if (this.modelSettings.softDelete) {
            return localStorageDb.softDelete(this.modelName, id);
        } else {
            return localStorageDb.delete(this.modelName, id);
        }
    }

    /**
     *
     * @returns the number of records
     */
    count(filter?: Partial<Omit<T, keyof Schema>>) {
        return localStorageDb.count(this.modelName, filter);
    }

    /**
     * Deletes all records in the model
     */
    truncate() {
        localStorageDb.truncate(this.modelName);
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
