import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import { ModelSettings } from "../src";
import { clear, createPersonModel, modelSettings, seed } from "./common";

describe.each(modelSettings)(
    "Basic functions: Deleting [$modelSettings]",
    (modelSettings: ModelSettings) => {
        beforeAll(seed);
        afterAll(clear);

        test("delete", () => {
            const personModel = createPersonModel(modelSettings);

            const person = personModel.findOne({
                name: "John Doe",
            });
            expect(person).not.toBeNull();

            const id = person!.id;
            person?.delete();

            const johnDoe = personModel.findById(id);
            if (modelSettings.softDelete) {
                expect(johnDoe).not.toBeNull();
                expect(johnDoe).toHaveProperty("isDeleted");
                expect(johnDoe!.isDeleted).toBe(true);
            } else {
                expect(johnDoe).toBeNull();
            }
        });
        test("model delete", () => {
            const personModel = createPersonModel(modelSettings);

            const person = personModel.findOne({
                name: "Jane Doe",
            });
            expect(person).not.toBeNull();
            const id = person!.id;

            const updatedRecord = personModel.delete(id);
            const janeDoe = personModel.findById(id);

            if (modelSettings.softDelete) {
                expect(janeDoe).not.toBeNull();
                expect(janeDoe).toHaveProperty("isDeleted");
                expect(janeDoe!.isDeleted).toBe(true);
            } else {
                expect(janeDoe).toBeNull();
            }
        });
        test("bulk delete", () => {
            const personModel = createPersonModel(modelSettings);

            const persons = personModel.find({
                age: 24,
            });

            expect(persons.length).toBeGreaterThan(0);
            const length = persons.length;
            persons.delete();

            const personsAged24 = personModel.find({
                age: 24,
            });
            if (modelSettings.softDelete) {
                expect(personsAged24.length).toBe(length);
                for (const person of personsAged24) {
                    expect(person).toHaveProperty("isDeleted");
                    expect(person.isDeleted).toBe(true);
                }
            } else {
                expect(personsAged24.length).toBe(0);
            }
        });
    }
);
