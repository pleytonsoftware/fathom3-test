import prisma from "../prisma";
import { Service } from "typedi";
import CommentInput from "../@types/models/comment/input";
import { PostComment } from "../@types/models/post/output";

@Service()
class CommentService {
    /**
     * Creates a new comment for a post
     *
     * @async
     * @param {CommentInput} commentInput - An object containing the content, author ID, and post ID of the new comment
     * @returns {Promise<PostComment>} - A promise that resolves to the newly created comment
     * @throws {Error} - Throws an error if there is an issue creating the comment
     */
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
