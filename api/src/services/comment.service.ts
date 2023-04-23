import prisma from "../prisma";
import { Service } from "typedi";
import type PostInput from "../@types/models/post/input";
import EditPostInput from "../@types/models/post/edit";
import { Comment, Post } from "@prisma/client";
import CommentInput from "../@types/models/comment/input";

@Service()
class CommentService {
    public async create(commentInput: CommentInput): Promise<Comment> {
        const comment = await prisma.comment.create({
            data: {
                content: commentInput.content,
                authorId: commentInput.authorId,
                postId: commentInput.postId,
            },
        });

        return comment;
    }
}

export default CommentService;
