import jwt from "jsonwebtoken";
import type { IUserAuthToken } from "../@types/routes/auth";

/**
 * Utility class for signing and verifying JSON Web Tokens (JWT).
 */
class JWTSigner {
    /**
     * Signs a JWT with the given payload, secret, and options.
     * @template T - The type of the payload.
     * @param {string | object | Buffer | T} payload - The payload to sign.
     * @param {jwt.Secret} secret - The secret key to sign the token with.
     * @param {jwt.SignOptions} [options] - Additional options for signing the token.
     * @returns {Promise<string>} - A Promise resolving to the signed JWT string.
     * @throws {Error} - If there is an error while signing the token.
     */
    public static sign = <T = any>(
        payload: string | object | Buffer | T,
        secret: jwt.Secret,
        options?: jwt.SignOptions,
    ) =>
        new Promise<string>((resolve, reject) => {
            jwt.sign(payload as any, secret, options || {}, (err, encoded) => {
                if (err) reject(err);
                else resolve(encoded!);
            });
        });

    /**
     * Verifies a JWT with the given token, secret, and options.
     * @param {string} token - The JWT to verify.
     * @param {jwt.Secret} secret - The secret key to verify the token with.
     * @param {jwt.VerifyOptions} [options] - Additional options for verifying the token.
     * @returns {Promise<IUserAuthToken>} - A Promise resolving to the decoded payload of the JWT.
     * @throws {Error} - If there is an error while verifying the token.
     */
    public static verify = (
        token: string,
        secret: jwt.Secret,
        options?: jwt.SignOptions,
    ) =>
        new Promise<IUserAuthToken>((resolve, reject) => {
            jwt.verify(token, secret, options, (err, decoded) => {
                if (err) reject(err);
                else resolve(decoded as IUserAuthToken);
            });
        });
}

export default JWTSigner;
