import { Model, Schema } from "./src";

interface Person extends Schema {
    name: string;
    age: number;
    hobbies: string[];
}
const personModel = new Model<Person>("person");
personModel.truncate();

const person = personModel.build();

person.name = "johnrey";
person.age = 1;

person.save();

const person2 = personModel.create({
    name: "john doe",
    age: 2,
    hobbies: [],
});
const person3 = personModel.build({
    name: "jane doe",
    age: 3,
    hobbies: ["acting"],
});

console.log(personModel.list());

person2.name = "ghege";

console.log(personModel.get(person2.id));

person2.save();

console.log(personModel.get(person2.id));

person3.save();

console.log(personModel.list());
