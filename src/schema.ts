export default interface Schema {
    /**
     * Unique identifier for the record
     */
    id: string;
    /**
     * Timestamp when the record was created
     */
    createdAt: Date;
    /**
     * Timestamp when the record was last updated
     */
    updatedAt: Date;
    /**
     * Flag if the record is deleted (in a soft delete model)
     */
    isDeleted: boolean;

    /**
     * Save this instance
     * @returns the saved instance
     */
    save(): Schema;
    /**
     * Delete this instance
     */
    delete();
}
