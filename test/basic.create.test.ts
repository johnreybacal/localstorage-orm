import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import { Model } from "../src";
import ModelSettings from "../src/modelSettings";
import { clear, createPersonModel, modelSettings } from "./common";

beforeAll(clear);
afterAll(clear);

describe.each(modelSettings)(
    "Basic functions: Creating [$modelSettings]",
    (modelSettings: ModelSettings) => {
        test("Instantiate a model", () => {
            const personModel = createPersonModel(modelSettings);

            expect(personModel).toBeDefined();
            expect(personModel).toBeInstanceOf(Model);
        });
        test("Build an instance", () => {
            const personModel = createPersonModel(modelSettings);

            const person = personModel.build();

            expect(person).toBeDefined();
        });
        test("Build and save an instance", () => {
            const personModel = createPersonModel(modelSettings);

            const person = personModel.build();

            person.name = "John Doe";
            person.age = 24;

            const result = person.save();

            expect(person.id).toBeDefined();
            expect(result.id).toBeDefined();
            expect(result).toEqual(person);

            if (modelSettings.timestamps) {
                expect(result.createdAt).toBeInstanceOf(Date);
            }
        });
        test("Create an instance", () => {
            const personModel = createPersonModel(modelSettings);

            const data = {
                name: "Jane Doe",
                age: 24,
            };

            const person = personModel.create(data);

            expect(person).toBeDefined();

            expect(person.id).toBeDefined();
            expect(person).toEqual(expect.objectContaining(data));
            if (modelSettings.timestamps) {
                expect(person.createdAt).toBeInstanceOf(Date);
            }
        });
        test("Bulk build an array of instance", () => {
            const personModel = createPersonModel(modelSettings);

            const dataArr = [
                {
                    name: "Bulk Person 1",
                    age: 1,
                },
                {
                    name: "Bulk Person 2",
                    age: 2,
                },
            ];

            const persons = personModel.build(dataArr);

            expect(persons.length).toEqual(2);
        });
        test("Bulk build and save an array of instance", () => {
            const personModel = createPersonModel(modelSettings);

            const dataArr = [
                {
                    name: "Bulk Person 1-1",
                    age: 1,
                },
                {
                    name: "Bulk Person 2-1",
                    age: 2,
                },
            ];

            const persons = personModel.build(dataArr);

            persons.save();

            persons.forEach((person) => {
                expect(person.id).toBeDefined();
                if (modelSettings.timestamps) {
                    expect(person.createdAt).toBeInstanceOf(Date);
                }
            });
        });
        test("Bulk create an array of instance", () => {
            const personModel = createPersonModel(modelSettings);

            const dataArr = [
                {
                    name: "Bulk Person 1-2",
                    age: 1,
                },
                {
                    name: "Bulk Person 2-2",
                    age: 2,
                },
            ];

            const persons = personModel.create(dataArr);

            persons.forEach((person) => {
                expect(person.id).toBeDefined();
                if (modelSettings.timestamps) {
                    expect(person.createdAt).toBeInstanceOf(Date);
                }
            });
        });
    }
);
