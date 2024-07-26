import { LocalStorage } from "node-localstorage";
import { Model, ModelSettings, Schema } from "./src";

if (typeof window === "undefined") {
    global.localStorage = new LocalStorage("./data");
}

interface Contact extends Schema {
    phone: number;
    email: string;
}
interface Employee extends Schema {
    name: string;
    job: string;
    contact: string | Contact;
}
interface Company extends Schema {
    name: string;
    employees: string[] | Employee[];
    contact: string | Contact;
}

const modelSettings: ModelSettings = {
    timestamps: true,
};
const contactModel = new Model<Contact>("contact", modelSettings);
const employeeModel = new Model<Employee>("employee", {
    ...modelSettings,
    references: [
        {
            modelName: "contact",
            property: "contact",
        },
    ],
});
const companyModel = new Model<Company>("company", {
    ...modelSettings,
    references: [
        {
            modelName: "employee",
            property: "employees",
            isArray: true,
        },
        {
            modelName: "contact",
            property: "contact",
        },
    ],
});

contactModel.truncate();
employeeModel.truncate();
companyModel.truncate();

const contact1 = contactModel.create({
    email: "1",
    phone: 1,
});
const contact2 = contactModel.create({
    email: "2",
    phone: 2,
});
const contact3 = contactModel.create({
    email: "3",
    phone: 3,
});

const employees = employeeModel.create([
    {
        job: "J1",
        name: "E1",
        contact: contact1.id,
    },
    {
        job: "J2",
        name: "E2",
        contact: contact2.id,
    },
]);

const company = companyModel.create({
    name: "C1",
    employees: employees.map(({ id }) => id),
    contact: contact3.id,
});

console.log(company);

company.populate("employees", 0);
company.populate("contact");

console.log(company);
