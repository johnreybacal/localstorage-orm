import LocalStorageDb from "./localstorage-db";
import Schema from "./schema";

export default class Model<T extends Schema> {
    protected modelName: string;
    private localStorageCrud: LocalStorageDb<T>;

    /**
     * Create a new model
     */
    constructor(modelName: string) {
        this.modelName = modelName;
        this.localStorageCrud = new LocalStorageDb<T>(this.modelName);
    }

    /**
     * Creates a new instance of the model
     */
    build(instance?: Omit<T, keyof Schema>): T {
        if (!instance) {
            instance = {} as T;
        }
        const instanceOfSchema = instance as T;

        instanceOfSchema.save = () => {
            if (instanceOfSchema.id) {
                return this.localStorageCrud.update(
                    instanceOfSchema.id,
                    instanceOfSchema
                );
            } else {
                return this.localStorageCrud.create(instanceOfSchema);
            }
        };
        instanceOfSchema.delete = () => {
            if (instanceOfSchema.id) {
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
        return this.localStorageCrud.list().map(this.build);
    }

    /**
     * Fetch a specific record based on ID
     * @param id ID of the record
     * @returns specific record
     */
    get(id: string) {
        return this.build(this.localStorageCrud.get(id));
    }

    /**
     * Create a new record in the model
     * @param record record to create
     * @returns record created
     */
    create(record: Omit<T, keyof Schema>) {
        return this.build(this.localStorageCrud.create(record as T));
    }

    /**
     * Update an existing record based on ID
     * @param id ID of the record
     * @param record record to update
     * @returns record updated
     */
    update(id: string, record: T) {
        return this.build(this.localStorageCrud.update(id, record));
    }

    /**
     * Delete a record based on ID
     * @param id ID of the record
     */
    delete(id: string) {
        this.localStorageCrud.delete(id);
    }

    /**
     * Deletes all records in the model
     */
    truncate() {
        this.localStorageCrud.truncate();
    }
}
