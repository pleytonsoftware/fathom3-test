import type { Prisma } from "@prisma/client";

type EditPostInput = Pick<Prisma.PostCreateInput, "title" | "content">;

export default EditPostInput;
