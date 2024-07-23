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
     * Save this instance
     * @returns the saved instance
     */
    save(): Schema;
    /**
     * Delete this instance
     */
    delete();
}
