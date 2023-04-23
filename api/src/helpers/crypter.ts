import bcrypt from "bcryptjs";

/**
 * A utility class for hashing and comparing passwords using bcrypt.
 */
export class Crypter {
    /**
     * Generates a hashed password for a given plain text password.
     *
     * @param {string} password The plain text password to hash.
     *
     * @returns {Promise<string>} A promise that resolves to the hashed password.
     */
    public static async generatePassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(Crypter.saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        return hashedPassword;
    }

    /**
     * Compares a plain text password to a hashed password to determine if they match.
     *
     * @param {string} password The plain text password to check.
     * @param {string} hashedPassword The hashed password to compare against.
     *
     * @returns {Promise<boolean>} A promise that resolves to true if the passwords match, false otherwise.
     */
    public static async passwordMatches(
        password: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    private static readonly saltRounds: number = 10;
}
