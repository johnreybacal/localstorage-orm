import InstanceMethods from "./instanceMethods";
import Model from "./model";

export class ModelManager {
    static #instance: ModelManager;

    private constructor() {}

    public static get instance(): ModelManager {
        if (!ModelManager.#instance) {
            ModelManager.#instance = new ModelManager();
            ModelManager.#instance.instanceMethods = {};
        }

        return ModelManager.#instance;
    }

    models: Model<any>[] = [];
    instanceMethods: Record<string, InstanceMethods<any>>;

    /**
     * register a model and its corresponding instanceMethods
     * @param model
     * @param instanceMethods
     */
    register(model: Model<any>, instanceMethods: InstanceMethods<any>) {
        const modelFound = this.getModel(model.modelName);

        if (modelFound) {
            const index = this.models
                .map(({ modelName }) => modelName)
                .indexOf(model.modelName);

            this.models.splice(index, 1, model);
        } else {
            this.models.push(model);
        }
        this.instanceMethods[model.modelName] = instanceMethods;
    }

    /**
     * lookup a record from the given model
     * @param modelName
     * @param id
     * @returns
     */
    lookUp(modelName: string, id: string) {
        const model = this.getModel(modelName);

        return model.findById(id);
    }

    /**
     * Get a model by name
     * @param modelName
     * @returns
     */
    getModel(modelName: string) {
        const modelsFound = this.models.filter(
            (model) => model.modelName === modelName
        );

        if (modelsFound.length > 0) {
            return modelsFound[0];
        } else {
            return null;
        }
    }

    /**
     * Get an instanceMethods by modelName
     * @param modelName
     * @returns
     */
    getInstanceMethods(modelName: string) {
        return this.instanceMethods[modelName];
    }
}

export default ModelManager.instance;
