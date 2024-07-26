import LocalStorageDb from "./localStorageDb";
import Model from "./model";
import Schema from "./schema";

interface Mapping {
    model: Model<Schema>;
    db: LocalStorageDb<Schema>;
}

export class ModelManager {
    static #instance: ModelManager;

    private constructor() {}

    public static get instance(): ModelManager {
        if (!ModelManager.#instance) {
            ModelManager.#instance = new ModelManager();
        }

        return ModelManager.#instance;
    }

    models: Mapping[] = [];

    addModel<T extends Schema>(model: Model<T>, db: LocalStorageDb<T>) {
        const modelsFound = this.models.filter(
            ({ model: m }) => m.modelName === model.modelName
        );

        if (modelsFound.length === 0) {
            this.models.push({
                model,
                db,
            });
        }
    }

    getReference() {}
}

export default ModelManager.instance;
