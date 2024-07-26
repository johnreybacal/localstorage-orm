import LocalStorageDb from "./localStorageDb";
import ModelManager from "./modelManager";
import ModelSettings from "./modelSettings";
import Schema from "./schema";

export default class InstanceMethods<T extends Schema> {
    private localStorageDb: LocalStorageDb<T>;
    private modelSettings: ModelSettings;

    constructor(
        localStorageCrud: LocalStorageDb<T>,
        modelSettings: ModelSettings
    ) {
        this.localStorageDb = localStorageCrud;
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
        instanceOfSchema.populate = (path: string, index?: number) => {
            let refs = this.modelSettings.references.filter(
                ({ property }) => property === path
            );

            if (refs.length > 0) {
                const reference = refs[0];

                if (reference.isArray) {
                    if (index === undefined) {
                        const ids: string[] = [...instanceOfSchema[path]];

                        for (let index = 0; index < ids.length; index++) {
                            instanceOfSchema[path][index] = ModelManager.lookUp(
                                reference.modelName,
                                instanceOfSchema[path][index]
                            );
                        }
                    } else {
                        instanceOfSchema[path][index] = ModelManager.lookUp(
                            reference.modelName,
                            instanceOfSchema[path][index]
                        );
                    }
                } else {
                    instanceOfSchema[path] = ModelManager.lookUp(
                        reference.modelName,
                        instanceOfSchema[path]
                    );
                }
            }
        };

        return instanceOfSchema;
    }

    public save(record: T) {
        if (record.id) {
            this.setUpdateTimestamp(record);

            const updatedRecord = this.localStorageDb.update(record.id, record);

            return this.build(updatedRecord);
        } else {
            this.setCreateTimestamp(record);
            record.id = crypto.randomUUID();

            const createdRecord = this.localStorageDb.create(record);

            return this.build(createdRecord);
        }
    }

    public delete(record: T) {
        if (this.modelSettings.softDelete) {
            this.localStorageDb.softDelete(record.id);
        } else {
            this.localStorageDb.delete(record.id);
        }
    }
}
