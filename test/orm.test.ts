import { describe, expect, test } from "@jest/globals";
import { Model, Schema } from "../src";
import ModelSettings from "../src/modelSettings";

const createPersonModel = (modelSettings?: ModelSettings) => {
    interface Person extends Schema {
        name: string;
        age: number;
    }
    const personModel = new Model<Person>("person", modelSettings);
    return personModel;
};

describe("localstorage-orm", () => {
    test("Instantiate a model", () => {
        const personModel = createPersonModel();

        expect(personModel).toBeDefined();
    });
    test("Build an instance", () => {
        const personModel = createPersonModel();

        const person = personModel.build();

        expect(person).toBeDefined();
    });
    test("Build and save an instance", () => {
        const personModel = createPersonModel();

        const person = personModel.build();

        person.name = "John Doe";
        person.age = 24;

        const result = person.save();

        expect(person.id).toBeDefined();
        expect(result.id).toBeDefined();
        expect(result).toEqual(person);
    });
    test("Create an instance", () => {
        const personModel = createPersonModel();

        const data = {
            name: "Jane Doe",
            age: 24,
        };

        const person = personModel.create(data);

        expect(person).toBeDefined();

        expect(person.id).toBeDefined();
        expect(person).toEqual(expect.objectContaining(data));
    });
});
