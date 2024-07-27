import Schema from "./schema";

export default class Instances<T extends Schema> extends Array<T> {
    /**
     * Save this list
     */
    save() {
        this.forEach((record) => {
            record.save();
        });
    }
    /**
     * Delete this list
     */
    delete() {
        this.forEach((record) => {
            record.delete();
        });
    }
    /**
     * Populate the path of all elements of this list
     * @param path to populate
     * @param index if path is an array and needs to populate a specific index
     */
    populate(path: string, index?: number) {
        this.forEach((record) => {
            record.populate(path, index);
        });
    }
}
