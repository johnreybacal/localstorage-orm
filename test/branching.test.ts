import { beforeEach, describe, expect, test } from "@jest/globals";
import { Model, ModelSettings, Schema } from "../src";
import { ModelManager } from "../src/modelManager";

const createModel = (modelSettings?: ModelSettings) => {
    interface FairlyNewSchema extends Schema {
        prop: string;
    }

    return new Model<FairlyNewSchema>("new-schema", modelSettings);
};

const createModelWithOneId = (modelSettings?: ModelSettings) => {
    localStorage.setItem(
        "localstorage-db-model-new-schema",
        JSON.stringify(["non-existent-id"])
    );

    return createModel(modelSettings);
};

beforeEach(() => {
    localStorage.removeItem("localstorage-db-model-new-schema");
});

describe("Coverage branchin", () => {
    test("get records from model without id list", () => {
        const model = createModel();

        const result = model.list();
        expect(result.length).toBe(0);
    });
    test("list: non existent id", () => {
        const model = createModelWithOneId();

        const result = model.list();
        expect(result.length).toBe(0);
    });
    test("find: non existent id", () => {
        const model = createModelWithOneId();

        const result = model.find({ prop: "what?" });
        expect(result.length).toBe(0);
    });
    test("softDelete: non existent id", () => {
        const model = createModelWithOneId({ softDelete: true });

        const result = model.delete("yet-another-non-existent-id");
        expect(result).toBe(false);
    });
    test("update: non existent id", () => {
        const model = createModelWithOneId();

        const result = model.update("yet-another-non-existent-id", {});
        expect(result).toBeNull();
    });
    test("delete: non existent id", () => {
        const model = createModelWithOneId();

        const result = model.delete("yet-another-non-existent-id");
        expect(result).toBe(false);
    });
    test("model manager", () => {
        const models = ModelManager.instance.models;
        expect(models).not.toBeNull();
    });
});
