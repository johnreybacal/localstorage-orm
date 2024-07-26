import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import { Model, ModelSettings, Schema } from "../src";

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

beforeAll(() => {
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

    companyModel.create({
        name: "C1",
        employees: employees.map(({ id }) => id),
        contact: contact3.id,
    });
});
afterAll(() => {
    contactModel.truncate();
    employeeModel.truncate();
    companyModel.truncate();
});

describe("Reference population", () => {
    test("populate one", () => {
        const employee = employeeModel.findOne({ name: "E1" });

        expect(employee).not.toBeNull();
        expect(typeof employee?.contact).toBe("string");

        employee?.populate("contact");
        expect(typeof employee?.contact).not.toBe("string");
        expect(employee?.contact).toEqual(
            expect.objectContaining({
                email: "1",
                phone: 1,
            })
        );
    });

    test("populate array", () => {
        const company = companyModel.findOne({ name: "C1" });
        expect(company).not.toBeNull();

        for (const employee of company!.employees) {
            expect(typeof employee).toBe("string");
        }

        company!.populate("employees");
        for (const employee of company!.employees) {
            expect(typeof employee).not.toBe("string");
        }
    });

    test("populate array index", () => {
        const company = companyModel.findOne({ name: "C1" });
        expect(company).not.toBeNull();

        for (const employee of company!.employees) {
            expect(typeof employee).toBe("string");
        }

        const populateIndex = 0;
        company!.populate("employees", populateIndex);
        for (let index = 0; index < company!.employees.length; index++) {
            if (index === populateIndex) {
                expect(typeof company!.employees[index]).not.toBe("string");
            } else {
                expect(typeof company!.employees[index]).toBe("string");
            }
        }
    });

    test("populate from list", () => {
        const employees = employeeModel.list();

        for (const employee of employees) {
            expect(typeof employee.contact).toBe("string");
        }

        employees.populate("contact");
        for (const employee of employees) {
            expect(typeof employee.contact).not.toBe("string");
        }
    });
});
