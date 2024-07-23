export default interface Schema {
    id: string;
    createdAt: Date;
    updatedAt: Date;

    save(): Schema;
    delete(): boolean;
}
