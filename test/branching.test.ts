import { beforeEach, describe, expect, test } from "@jest/globals";
import { Model, Schema } from "../src";

const createModel = () => {
    interface FairlyNewSchema extends Schema {
        prop: string;
    }

    return new Model<FairlyNewSchema>("new-schema", {
        softDelete: true,
    });
};

beforeEach(() => {
    localStorage.removeItem("localstorage-db-model-new-schema");
});

describe("Coverage branchinh", () => {
    test("get records from model without id list", () => {
        const model = createModel();

        const result = model.list();

        expect(result.length).toBe(0);
    });
    test("list: non existent id", () => {
        const model = createModel();

        localStorage.setItem(
            "localstorage-db-model-new-schema",
            JSON.stringify(["non-existent-id"])
        );

        const result = model.list();

        expect(result.length).toBe(0);
    });
    test("find: non existent id", () => {
        const model = createModel();

        localStorage.setItem(
            "localstorage-db-model-new-schema",
            JSON.stringify(["non-existent-id"])
        );

        const result = model.find({ prop: "what?" });

        expect(result.length).toBe(0);
    });
    test("softDelete: non existent id", () => {
        const model = createModel();

        localStorage.setItem(
            "localstorage-db-model-new-schema",
            JSON.stringify(["non-existent-id"])
        );

        model.delete("yet-another-non-existent-id");
    });
});
