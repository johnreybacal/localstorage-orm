import LocalStorageCrud from "./lib";

console.log("hello world")

// localStorage is not defined when running in terminal
const personModel = new LocalStorageCrud('person');


// personModel.add({name: 'test'})
const data = personModel.list();
console.log(data)


console.log(data)