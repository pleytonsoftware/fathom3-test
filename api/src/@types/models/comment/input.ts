import type { Prisma } from "@prisma/client";

type CommentInput = Pick<Prisma.CommentCreateInput, "content"> & {
    authorId: number;
    postId: number;
};

export default CommentInput;
