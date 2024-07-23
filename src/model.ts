import LocalStorageCrud from "./localstorage-crud";
import Schema from "./schema";

export default class Model<T extends Schema> {
    protected modelName: string;
    private localStorageCrud: LocalStorageCrud<T>;

    constructor(modelName: string) {
        this.modelName = modelName;
        this.localStorageCrud = new LocalStorageCrud<T>(this.modelName);
    }

    build(instance?: T): T {
        if (!instance) {
            instance = {} as T;
        }

        instance.save = () => {
            if (instance.id) {
                return this.localStorageCrud.update(instance.id, instance);
            } else {
                return this.localStorageCrud.create(instance);
            }
        };
        instance.delete = () => {
            if (instance.id) {
                this.localStorageCrud.delete(instance.id);
            }
        };

        return instance;
    }

    list() {
        return this.localStorageCrud.list().map(this.build);
    }

    get(id: string) {
        return this.build(this.localStorageCrud.get(id));
    }

    create(data: Omit<T, keyof Schema>) {
        return this.build(this.localStorageCrud.create(data as T));
    }

    update(id: string, data: T) {
        return this.build(this.localStorageCrud.update(id, data));
    }

    truncate() {
        this.localStorageCrud.truncate();
    }
}
