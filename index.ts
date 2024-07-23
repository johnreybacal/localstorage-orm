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

console.log(personModel.list());
