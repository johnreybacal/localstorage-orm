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
        const modelFound = this.findModel(model.modelName);

        if (!modelFound) {
            this.models.push({
                model,
                db,
            });
        }
    }

    lookUp(modelName: string, id: string) {
        const model = this.findModel(modelName);

        return model.findById(id);
    }

    private findModel(modelName: string) {
        const modelsFound = this.models.filter(
            ({ model }) => model.modelName === modelName
        );

        if (modelsFound.length > 0) {
            return modelsFound[0].model;
        } else {
            return null;
        }
    }
}

export default ModelManager.instance;
