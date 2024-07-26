interface Reference {
    property: string;
    modelName: string;
    isArray?: boolean;
}

export default interface ModelSettings {
    timestamps?: boolean;
    softDelete?: boolean;
    references?: Reference[];
}
