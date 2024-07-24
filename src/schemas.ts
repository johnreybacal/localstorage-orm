import InstanceMethods from "./instanceMethods";
import Schema from "./schema";

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

export default class Schemas<T extends Schema>
    extends Array<T>
    implements SchemasI<T>
{
    private instanceMethods: InstanceMethods<T>;
    constructor(instanceMethods: InstanceMethods<T>) {
        super();
        this.instanceMethods = instanceMethods;
    }
    save() {
        this.forEach((record) => {
            this.instanceMethods.save(record);
        });
    }
    delete() {
        this.forEach((record) => {
            this.instanceMethods.delete(record);
        });
    }
}
