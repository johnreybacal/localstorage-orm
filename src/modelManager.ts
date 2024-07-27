import Model from "./model";

export class ModelManager {
    static #instance: ModelManager;

    private constructor() {}

    public static get instance(): ModelManager {
        if (!ModelManager.#instance) {
            ModelManager.#instance = new ModelManager();
        }

        return ModelManager.#instance;
    }

    models: Model<any>[] = [];

    addModel(model: Model<any>) {
        const modelFound = this.findModel(model.modelName);

        if (!modelFound) {
            this.models.push(model);
        }
    }

    lookUp(modelName: string, id: string) {
        const model = this.findModel(modelName);

        return model.findById(id);
    }

    private findModel(modelName: string) {
        const modelsFound = this.models.filter(
            (model) => model.modelName === modelName
        );

        if (modelsFound.length > 0) {
            return modelsFound[0];
        } else {
            return null;
        }
    }
}

export default ModelManager.instance;
