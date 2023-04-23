import prisma from "../prisma";
import { Service } from "typedi";
import type PostInput from "../@types/models/post/input";
import EditPostInput from "../@types/models/post/edit";
import { Post, User } from "@prisma/client";
import ROLES from "../@types/models/user/roles";

@Service()
class PostService {
    /**
     * Create a new post
     * @async
     * @param {Object} postInput - Post input object
     * @param {string} postInput.title - Post title
     * @param {string} postInput.content - Post content
     * @param {number} postInput.authorId - ID of the post author
     * @param {Date} [postInput.publishedAt] - Post publish date (optional)
     * @returns {Promise<Post>} Created post object
     */
    public async create(postInput: PostInput): Promise<Post> {
        const post = await prisma.post.create({
            data: {
                title: postInput.title,
                content: postInput.content,
                authorId: postInput.authorId,
                publishedAt: postInput.publishedAt,
            },
        });

        return post;
    }

    /**
     * Find a post by ID
     * @async
     * @param {number} postId - ID of the post to find
     * @returns {Promise<Post|null>} Found post object, or null if not found
     */
    public async find(postId: number): Promise<Post | null> {
        const post = await prisma.post.findFirst({
            where: {
                id: postId,
                publishedAt: {
                    gte: new Date(),
                },
                deleted: false,
            },
            include: {
                comments: {
                    orderBy: {
                        createdAt: "asc",
                    },
                    include: {
                        author: true,
                    },
                },
            },
        });

        return post;
    }

    /**
     * Find all published posts, ordered by publishedAt and createdAt (newer first)
     * @async
     * @returns {Promise<Array<Post>>} Array of published post objects
     */
    public async findAll(): Promise<Array<Post>> {
        // TODO add pagination
        const posts = await prisma.post.findMany({
            where: {
                publishedAt: {
                    gte: new Date(),
                },
                deleted: false,
            },
            orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        });

        return posts;
    }

    /**
     * Update a post by ID
     * @async
     * @param {number} postId - ID of the post to update
     * @param {number} userId - ID of the user making the update
     * @param {Object} editPostInput - Edited post input object
     * @param {string} editPostInput.title - Post title
     * @param {string} editPostInput.content - Post content
     * @returns {Promise<Post|null>} Updated post object, or null if not found or unauthorized
     */
    public async update(
        postId: number,
        userId: number,
        editPostInput: EditPostInput,
    ): Promise<Post | null> {
        const post = await this.find(postId);

        if (post?.authorId !== userId) {
            return null;
        }

        const updatedPost = await prisma.post.update({
            data: {
                title: editPostInput.title,
                content: editPostInput.content,
            },
            where: {
                id: postId,
            },
        });

        return updatedPost;
    }

    /**
     * Delete a post by ID
     * @async
     * @param {number} postId - ID of the post to delete
     * @param {number} userId - ID of the user making the delete
     * @returns {Promise<boolean>} True if post was deleted, false if not found or unauthorized
     */
    public async delete(
        postId: number,
        user: Pick<User, "id" | "role">,
    ): Promise<boolean> {
        const post = await this.find(postId);

        if (user.role !== ROLES.admin && post?.authorId !== user.id) {
            return false;
        }

        await prisma.post.update({
            data: {
                deleted: true,
            },
            where: {
                id: postId,
            },
        });

        return true;
    }
}

export default PostService;
