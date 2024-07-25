import { describe, expect, test } from "@jest/globals";
import { Model, Schema } from "../src";

describe("Failures", () => {
    test("get records from model without id list", () => {
        interface Failure extends Schema {
            prop: string;
        }

        const failureModel = new Model<Failure>("failure");

        const list = failureModel.list();

        expect(list.length).toBe(0);
    });
});
