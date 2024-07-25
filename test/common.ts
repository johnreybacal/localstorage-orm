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
