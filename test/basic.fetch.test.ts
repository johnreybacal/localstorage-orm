import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import { Instances } from "../src";
import { clear, createPersonModel, Person, seed } from "./common";

beforeAll(seed);
afterAll(clear);

describe("Basic functions: Fetching", () => {
    test("list", () => {
        const personModel = createPersonModel();

        const persons = personModel.list();

        expect(persons).toBeInstanceOf(Instances<Person>);
        expect(persons.length).toBeGreaterThan(0);
    });
    test("find", () => {
        const personModel = createPersonModel();

        const persons = personModel.find({
            age: 24,
        });

        expect(persons).toBeInstanceOf(Instances<Person>);
        expect(persons.length).toBeGreaterThan(0);
        persons.forEach((person) => expect(person.age).toBe(24));
    });
    test("findOne", () => {
        const personModel = createPersonModel();

        const person = personModel.findOne({
            name: "John Doe",
        });

        expect(person).not.toBeNull();
        expect(person!.name).toBe("John Doe");
    });
    test("findById", () => {
        const personModel = createPersonModel();

        const filter = {
            name: "John Doe",
        };

        const johnDoe = personModel.findOne(filter);

        expect(johnDoe).not.toBeNull();

        const johnDoeAgain = personModel.findById(johnDoe!.id);
        const johnDoeAgainAndAgain = personModel.get(johnDoe!.id);

        expect(johnDoeAgain).toEqual(expect.objectContaining(filter));
        expect(johnDoeAgainAndAgain).toEqual(expect.objectContaining(filter));
    });
});
