import InstanceMethods from "./instanceMethods";
import Schema from "./schema";

export default class Instances<T extends Schema> extends Array<T> {
    private instance: InstanceMethods<T>;
    constructor(instance: InstanceMethods<T>) {
        super();
        this.instance = instance;
    }
    save() {
        this.forEach((record) => {
            this.instance.save(record);
        });
    }
    delete() {
        this.forEach((record) => {
            this.instance.delete(record);
        });
    }
}
