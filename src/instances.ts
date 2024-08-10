import InstanceMethods from "./instanceMethods";
import modelManager from "./modelManager";
import Schema from "./schema";

export default class Instances<T extends Schema> extends Array<T> {
    private instanceMethods: InstanceMethods<T>;

    constructor(modelName: string) {
        super();
        this.instanceMethods = modelManager.getInstanceMethods(
            modelName
        ) as InstanceMethods<T>;
    }
    /**
     * Save this list
     */
    save() {
        this.forEach((record) => this.instanceMethods.save(record));
    }
    /**
     * Delete this list
     */
    delete() {
        this.forEach((record) => this.instanceMethods.delete(record));
    }
    /**
     * Populate the path of all elements of this list
     * @param path to populate
     * @param index if path is an array and needs to populate a specific index
     */
    populate(path: string, index?: number) {
        this.forEach((record) =>
            this.instanceMethods.populate(record, path, index)
        );
    }

    push(...items: T[]): number {
        items = items.map(this.instanceMethods.build);
        return super.push(...items);
    }
}
