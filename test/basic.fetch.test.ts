import { describe, expect, test } from "@jest/globals";
import { Schemas } from "../src";
import { createPersonModel, Person } from "./common";

describe("Basic functions: Fetching", () => {
    test("List", () => {
        const personModel = createPersonModel();

        const persons = personModel.list();

        expect(persons).toBeInstanceOf(Schemas<Person>);
        expect(persons.length).toBeGreaterThan(0);
    });
    test("Find", () => {
        const personModel = createPersonModel();

        const persons = personModel.find({
            age: 24,
        });

        expect(persons).toBeInstanceOf(Schemas<Person>);
        expect(persons.length).toBeGreaterThan(0);
        persons.forEach((person) => expect(person.age).toBe(24));
    });
});
