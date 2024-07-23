import Model from "./src/model";
import Schema from "./src/schema";

interface Person extends Schema {
    name: string;
    age: number;
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
});
const person3 = personModel.build({
    name: "jane doe",
    age: 3,
});

console.log(personModel.list());

person2.name = "ghege";

console.log(personModel.get(person2.id));

person2.save();

console.log(personModel.get(person2.id));

person3.save();

console.log(personModel.list());
