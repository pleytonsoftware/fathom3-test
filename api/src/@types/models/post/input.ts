import type { Prisma } from "@prisma/client";

type PostInput = Pick<
    Prisma.PostCreateInput,
    "title" | "content" | "publishedAt"
> & {
    authorId: number;
};

export default PostInput;
