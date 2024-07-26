import InstanceMethods from "./instanceMethods";
import Schema from "./schema";

export default class Instances<T extends Schema> extends Array<T> {
    private instance: InstanceMethods<T>;
    constructor(instance: InstanceMethods<T>) {
        super();
        this.instance = instance;
    }
    /**
     * Save this list
     */
    save() {
        this.forEach((record) => {
            this.instance.save(record);
        });
    }
    /**
     * Delete this list
     */
    delete() {
        this.forEach((record) => {
            this.instance.delete(record);
        });
    }
    /**
     * Populate the path of all elements of this list
     * @param path to populate
     * @param index if path is an array and needs to populate a specific index
     */
    populate(path: string, index?: number) {
        this.forEach((record) => {
            this.instance.populate(record, path, index);
        });
    }
}
