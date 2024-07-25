import { Model, ModelSettings, Schema } from "../src";

export interface Person extends Schema {
    name: string;
    age: number;
}
export const createPersonModel = (modelSettings?: ModelSettings) => {
    const personModel = new Model<Person>("person", modelSettings);
    return personModel;
};
export const modelSettings: ModelSettings[] = [
    {},
    {
        timestamps: true,
        softDelete: true,
    },
];
export const clear = () => {
    createPersonModel().truncate();
};
export const seed = () => {
    clear();
    createPersonModel().create([
        {
            name: "John Doe",
            age: 24,
        },
        {
            name: "Jane Doe",
            age: 24,
        },
        {
            name: "Buck Hoe",
            age: 45,
        },
        {
            name: "Mama Joe",
            age: 52,
        },
    ]);
};
