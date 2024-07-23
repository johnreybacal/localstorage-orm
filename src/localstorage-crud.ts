import { LocalStorage } from "node-localstorage";
import Schema from "./schema";

global.localStorage = new LocalStorage("./data");

export default class LocalStorageCrud<T extends Schema> {
    protected modelName: string;

    constructor(modelName: string) {
        this.modelName = modelName;
    }

    public list(): T[] {
        const idList = this.getIdList();
        const data: T[] = [];

        idList.forEach((id: string) => {
            data.push(this.get(id));
        });

        return data;
    }

    public get(id: string): T {
        const json = JSON.parse(localStorage.getItem(id) ?? "{}");

        return Object.keys.length ? json : undefined;
    }

    public create(data: T) {
        data.id = crypto.randomUUID();

        const idList = this.getIdList();
        idList.push(data.id);
        this.saveIdList(idList);

        data.createdAt = new Date();
        localStorage.setItem(data.id, JSON.stringify(data));

        return data;
    }

    public update(id: string, data: T) {
        data.updatedAt = new Date();
        localStorage.setItem(id, JSON.stringify(data));

        return data;
    }

    public delete(id: string) {
        const idList = this.getIdList();
        idList.splice(idList.indexOf(id), 1);
        this.saveIdList(idList);

        localStorage.removeItem(id);
    }

    public truncate() {
        const idList = this.getIdList();

        idList.forEach((id: string) => {
            this.delete(id);
        });
    }

    private getIdList(): Array<string> {
        return JSON.parse(localStorage.getItem(this.modelName) ?? "[]") ?? [];
    }

    private saveIdList(idList: Array<string>) {
        return localStorage.setItem(this.modelName, JSON.stringify(idList));
    }
}
