import LocalStorageDb from "./localstorage-db";
import ModelSettings from "./modelSettings";
import Schema from "./schema";

export default class InstanceMethods<T extends Schema> {
    private localStorageCrud: LocalStorageDb<T>;
    private modelSettings: ModelSettings;

    constructor(
        localStorageCrud: LocalStorageDb<T>,
        modelSettings: ModelSettings
    ) {
        this.localStorageCrud = localStorageCrud;
        this.modelSettings = modelSettings;
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

    public build(instance?: Omit<T, keyof Schema>): T {
        if (!instance) {
            instance = {} as T;
        }
        const instanceOfSchema = instance as T;

        instanceOfSchema.save = () => {
            return this.save(instanceOfSchema);
        };
        instanceOfSchema.delete = () => {
            this.delete(instanceOfSchema);
        };

        return instanceOfSchema;
    }

    public save(record: T) {
        if (record.id) {
            this.setUpdateTimestamp(record);

            const updatedRecord = this.localStorageCrud.update(
                record.id,
                record
            );

            return this.build(updatedRecord);
        } else {
            this.setCreateTimestamp(record);
            record.id = crypto.randomUUID();

            const createdRecord = this.localStorageCrud.create(record);

            return this.build(createdRecord);
        }
    }
    public delete(record: T) {
        if (this.modelSettings.softDelete) {
            this.localStorageCrud.softDelete(record.id);
        } else {
            this.localStorageCrud.delete(record.id);
        }
    }
}
