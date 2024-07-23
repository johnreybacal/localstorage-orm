import { LocalStorage } from "node-localstorage";

global.localStorage = new LocalStorage("./scratch");

export default class LocalStorageCrud {
    protected modelName: string;

    constructor(modelName: string) {
        this.modelName = `localstorage-crud-model-${modelName}`;
    }

    public list(): any[] {
        const idList = this.getIdList();
        const models: any[] = new Array();

        idList.forEach((id: string) => {
            models.push(this.get(id));
        });

        return models;
    }

    public get(id: string): any {
        const json = JSON.parse(localStorage.getItem(id) ?? "{}");

        return Object.keys.length ? json : undefined;
    }

    public create(model: any) {
        model.id = Math.random().toString(16).slice(2);

        const idList = this.getIdList();
        idList.push(model.id);
        this.saveIdList(idList);

        localStorage.setItem(model.id, JSON.stringify(model));
    }

    public update(model: any) {
        localStorage.setItem(model.id!, JSON.stringify(model));
    }

    public delete(id: string) {
        const idList = this.getIdList();
        idList.splice(idList.indexOf(id), 1);
        this.saveIdList(idList);

        localStorage.removeItem(id);
    }

    private getIdList(): Array<string> {
        return JSON.parse(localStorage.getItem(this.modelName) ?? "[]") ?? [];
    }

    private saveIdList(idList: Array<string>) {
        return localStorage.setItem(this.modelName, JSON.stringify(idList));
    }
}
