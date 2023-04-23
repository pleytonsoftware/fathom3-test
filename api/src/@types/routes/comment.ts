import type { Prisma } from "@prisma/client";

export type CommentInputBody = Pick<Prisma.CommentCreateInput, "content">;
