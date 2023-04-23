import type { RouteHandlerMethod } from "fastify";
import type { PostEditInputBody, PostInputBody } from "../@types/routes/post";
import type { IUserRequest } from "../@types/routes/auth";
import type { FindById } from "../@types/routes";
import Container from "typedi";
import PostService from "../services/post.service";
import { CommentInputBody } from "../@types/routes/comment";
import CommentService from "../services/comment.service";

const postService = Container.get(PostService);

export const create: RouteHandlerMethod = async (req, reply) => {
    const { title, content, publishedAt } = req.body as PostInputBody;
    const user = (req as IUserRequest).authUser;

    const post = await postService.create({
        authorId: user.id,
        title,
        content,
        publishedAt: publishedAt && new Date(publishedAt),
    });

    reply.send(post);
};

export const findAll: RouteHandlerMethod = async (req, reply) => {
    // TODO pagination (FindAllOptions type)
    const posts = await postService.findAll();
    reply.send(posts);
};

export const find: RouteHandlerMethod = async (req, reply) => {
    const { id } = req.params as FindById;
    const post = await postService.find(Number(id));

    reply.send(post);
};

export const update: RouteHandlerMethod = async (req, reply) => {
    const { id } = req.params as FindById;
    const { title, content } = req.body as PostEditInputBody;
    const user = (req as IUserRequest).authUser;

    const post = await postService.update(Number(id), user.id, {
        title,
        content,
    });

    reply.send(post);
};

export const remove: RouteHandlerMethod = async (req, reply) => {
    const { id } = req.params as FindById;
    const user = (req as IUserRequest).authUser;

    const deleted = await postService.delete(Number(id), user);

    reply.send(deleted);
};

export const addComment: RouteHandlerMethod = async (req, reply) => {
    const { id } = req.params as FindById;
    const user = (req as IUserRequest).authUser;
    const { content } = req.body as CommentInputBody;

    const commentService = Container.get(CommentService);

    const comment = await commentService.create({
        authorId: user.id,
        postId: Number(id),
        content,
    });

    reply.send(comment);
};
