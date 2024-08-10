import { afterEach, beforeEach, describe, expect, test } from "@jest/globals";
import { ModelSettings } from "../src";
import { clear, createPersonModel, modelSettings, seed } from "./common";

describe.each(modelSettings)(
    "Find [$modelSettings]",
    (modelSettings: ModelSettings) => {
        beforeEach(seed);
        afterEach(clear);

        test("findAndUpdate", () => {
            const model = createPersonModel(modelSettings);

            const personAged24InitialCount = model.count({ age: 24 });
            const personAged25InitialCount = model.count({ age: 25 });
            const updatedPersons = model.findAndUpdate(
                { age: 24 },
                { age: 25 }
            );
            const personAged24FinalCount = model.count({ age: 24 });
            const personAged25FinalCount = model.count({ age: 25 });

            expect(updatedPersons.length).toBe(personAged24InitialCount);
            expect(personAged24FinalCount).toBe(0);
            expect(personAged25InitialCount + personAged24InitialCount).toBe(
                personAged25FinalCount
            );

            if (modelSettings.timestamps) {
                for (const person of updatedPersons) {
                    expect(new Date(person.updatedAt)).toBeInstanceOf(Date);
                }
            }
        });

        test("findAndDelete", () => {
            const model = createPersonModel(modelSettings);

            const personAged24InitialCount = model.count({ age: 24 });
            model.findAndDelete({ age: 24 });
            const personAged24FinalCount = model.count({ age: 24 });

            expect(personAged24InitialCount).toBeGreaterThan(0);

            if (modelSettings.softDelete) {
                expect(personAged24FinalCount).toBe(personAged24InitialCount);
            } else {
                expect(personAged24FinalCount).toBe(0);
            }
        });
    }
);
