import prisma from "../prisma";
import { Service } from "typedi";
import CommentInput from "../@types/models/comment/input";
import { PostComment } from "../@types/models/post/output";

@Service()
class CommentService {
    public async create(commentInput: CommentInput): Promise<PostComment> {
        const comment = await prisma.comment.create({
            data: {
                content: commentInput.content,
                authorId: commentInput.authorId,
                postId: commentInput.postId,
            },
            select: {
                id: true,
                content: true,
                author: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                createdAt: true,
                updatedAt: true,
            },
        });

        return comment;
    }
}

export default CommentService;
