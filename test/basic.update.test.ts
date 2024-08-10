import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import { ModelSettings } from "../src";
import { clear, createPersonModel, modelSettings, seed } from "./common";

describe.each(modelSettings)(
    "Basic functions: Updating [$modelSettings]",
    (modelSettings: ModelSettings) => {
        beforeAll(seed);
        afterAll(clear);

        test("update using save", () => {
            const personModel = createPersonModel(modelSettings);

            const person = personModel.findOne({
                name: "John Doe",
            });
            expect(person).not.toBeNull();

            person!.name = "Johnny Doe";

            person?.save();

            const id = person!.id;

            const johnDoe = personModel.findOne({
                name: "John Doe",
            });
            const johnnyDoe = personModel.findOne({
                name: "Johnny Doe",
            });

            expect(johnDoe).toBeNull();
            expect(johnnyDoe).not.toBeNull();
            expect(johnnyDoe!.id).toBe(id);
            if (modelSettings.timestamps) {
                expect(new Date(johnnyDoe!.updatedAt)).toBeInstanceOf(Date);
            }
        });
        test("model update", () => {
            const personModel = createPersonModel(modelSettings);

            const person = personModel.findOne({
                name: "Jane Doe",
            });
            expect(person).not.toBeNull();
            const id = person!.id;

            const updatedRecord = personModel.findByIdAndUpdate(id, {
                name: "Jenny Doe",
                age: 24,
            });

            const janeDoe = personModel.findOne({
                name: "Jane Doe",
            });
            const jennyDoe = personModel.findOne({
                name: "Jenny Doe",
            });

            expect(janeDoe).toBeNull();
            expect(jennyDoe).not.toBeNull();
            expect(jennyDoe!.id).toBe(id);
            expect(updatedRecord).not.toBeNull();
            expect(updatedRecord!.id).toBe(id);
            if (modelSettings.timestamps) {
                expect(new Date(jennyDoe!.updatedAt)).toBeInstanceOf(Date);
                expect(new Date(updatedRecord!.updatedAt)).toBeInstanceOf(Date);
            }
        });
        test("bulk update", () => {
            const personModel = createPersonModel(modelSettings);

            const persons = personModel.find({
                age: 24,
            });

            const length = persons.length;

            for (let person of persons) {
                // What's better than 24?
                person.age = 25;
            }

            persons.save();

            const personsAged24 = personModel.find({
                age: 24,
            });
            const personsAged25 = personModel.find({
                age: 25,
            });

            expect(personsAged24.length).toBe(0);
            expect(personsAged25.length).toBe(length);
            if (modelSettings.timestamps) {
                for (const person of personsAged25) {
                    expect(new Date(person.updatedAt)).toBeInstanceOf(Date);
                }
            }
        });
        test("update a non existent id", () => {
            const model = createPersonModel(modelSettings);

            const result = model.update("non-existent-id", {
                name: "I do not exist",
                age: 0,
            });

            expect(result).toBeNull();
        });
    }
);
