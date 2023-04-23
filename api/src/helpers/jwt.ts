import jwt from "jsonwebtoken";
import type { IUserAuthToken } from "../@types/routes/auth";

class JWTSigner {
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
