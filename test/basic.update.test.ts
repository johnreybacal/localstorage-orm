import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import { ModelSettings } from "../src";
import { clear, createPersonModel, modelSettings, seed } from "./common";

describe.each(modelSettings)(
    "Basic functions: Updating [$modelSettings]",
    (modelSettings: ModelSettings) => {
        beforeAll(seed);
        afterAll(clear);

        test("update", () => {
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
        });
    }
);
