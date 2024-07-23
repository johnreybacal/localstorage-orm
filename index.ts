import LocalStorageCrud from "./src";

const personModel = new LocalStorageCrud("person");

let data = personModel.list();
console.log(data);
personModel.create({ name: "test" });
data = personModel.list();

console.log(data);
