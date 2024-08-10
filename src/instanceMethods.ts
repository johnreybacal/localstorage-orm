import { localStorageDb } from "./localStorageDb";
import ModelManager from "./modelManager";
import ModelSettings from "./modelSettings";
import Schema from "./schema";
import { Record } from "./types";

export default class InstanceMethods<T extends Schema> {
    readonly modelSettings: ModelSettings;
    readonly modelName: string;

    constructor(modelName: string, modelSettings: ModelSettings) {
        this.modelName = modelName;
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

    public build(instance?: Record<T>): T {
        const instanceOfSchema = (instance ?? {}) as T;

        instanceOfSchema.save = () => {
            return this.save(instanceOfSchema);
        };
        instanceOfSchema.delete = () => {
            this.delete(instanceOfSchema);
        };
        instanceOfSchema.populate = (path: string, index?: number) => {
            this.populate(instanceOfSchema, path, index);
        };

        return instanceOfSchema;
    }

    public save(record: T) {
        if (record.id) {
            this.setUpdateTimestamp(record);

            const updatedRecord = localStorageDb.update(
                this.modelName,
                record.id,
                record
            );

            return this.build(updatedRecord);
        } else {
            this.setCreateTimestamp(record);
            record.id = crypto.randomUUID();

            const createdRecord = localStorageDb.create(this.modelName, record);

            return this.build(createdRecord);
        }
    }

    public delete(record: T) {
        if (this.modelSettings.softDelete) {
            localStorageDb.softDelete(this.modelName, record.id);
        } else {
            localStorageDb.delete(this.modelName, record.id);
        }
    }

    public populate(record: T, path: string, index?: number) {
        let refs = this.modelSettings.references.filter(
            ({ property }) => property === path
        );

        if (refs.length > 0) {
            const reference = refs[0];

            if (reference.isArray) {
                if (index === undefined) {
                    const ids: string[] = [...record[path]];

                    for (let index = 0; index < ids.length; index++) {
                        record[path][index] = ModelManager.lookUp(
                            reference.modelName,
                            record[path][index]
                        );
                    }
                } else {
                    record[path][index] = ModelManager.lookUp(
                        reference.modelName,
                        record[path][index]
                    );
                }
            } else {
                record[path] = ModelManager.lookUp(
                    reference.modelName,
                    record[path]
                );
            }
        }
    }
}
