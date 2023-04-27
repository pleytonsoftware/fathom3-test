import type { RouteHandlerMethod } from "fastify";
import type { PostEditInputBody, PostInputBody } from "../@types/routes/post";
import type { IUserRequest } from "../@types/routes/auth";
import type { FindById } from "../@types/routes";
import Container from "typedi";
import PostService from "../services/post.service";
import { CommentInputBody } from "../@types/routes/comment";
import CommentService from "../services/comment.service";

const postService = Container.get(PostService);

/**
 * Creates a new post.
 * @param {import("fastify").FastifyRequest} req - The request object.
 * @param {import("fastify").FastifyReply} reply - The reply object.
 * @returns {Promise<void>}
 */
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

/**
 * Finds all posts.
 * @param {import("fastify").FastifyRequest} req - The request object.
 * @param {import("fastify").FastifyReply} reply - The reply object.
 * @returns {Promise<void>}
 */
export const findAll: RouteHandlerMethod = async (req, reply) => {
    const posts = await postService.findAll();
    reply.send(posts);
};

/**
 * Finds a post by ID.
 * @param {import("fastify").FastifyRequest} req - The request object.
 * @param {import("fastify").FastifyReply} reply - The reply object.
 * @returns {Promise<void>}
 */
export const find: RouteHandlerMethod = async (req, reply) => {
    const { id } = req.params as FindById;
    const post = await postService.find(Number(id));

    reply.send(post);
};

/**
 * Removes a post.
 * @param {import("fastify").FastifyRequest} req - The request object.
 * @param {import("fastify").FastifyReply} reply - The reply object.
 * @returns {Promise<void>}
 */
export const remove: RouteHandlerMethod = async (req, reply) => {
    const { id } = req.params as FindById;
    const user = (req as IUserRequest).authUser;

    const deleted = await postService.delete(Number(id), user);

    reply.send(deleted);
};

/**
 * Adds a comment to a post.
 * @param {import("fastify").FastifyRequest} req - The request object.
 * @param {import("fastify").FastifyReply} reply - The reply object.
 * @returns {Promise<void>}
 */
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
