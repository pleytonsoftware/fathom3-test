import type PostInput from "../models/post/input";

export type PostInputBody = Pick<
    PostInput,
    "title" | "content" | "publishedAt"
>;

export type PostEditInputBody = Pick<PostInputBody, "title" | "content">;
