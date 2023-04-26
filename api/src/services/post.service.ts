import prisma from "../prisma";
import { Service } from "typedi";
import type PostInput from "../@types/models/post/input";
import EditPostInput from "../@types/models/post/edit";
import { Post, User } from "@prisma/client";
import ROLES from "../@types/models/user/roles";
import PostItem, { PostDetailed } from "../@types/models/post/output";

const DEFAULT_IMAGE =
    "https://fastly.picsum.photos/id/638/200/200.jpg?hmac=64UpQ4ouFUNEG9cnXLQ9GxchDShg-mL1rdCrZGfc94U";
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
    public async create(postInput: PostInput): Promise<PostDetailed> {
        let imageUrl = DEFAULT_IMAGE;
        try {
            const image = await fetch("https://picsum.photos/200");
            imageUrl = image.url;
        } catch (e) {}

        const post = await prisma.post.create({
            data: {
                title: postInput.title,
                image: imageUrl,
                content: postInput.content,
                authorId: postInput.authorId,
                publishedAt: postInput.publishedAt,
            },
            select: {
                id: true,
                title: true,
                author: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                _count: {
                    select: {
                        comments: true,
                    },
                },
                image: true,
                content: true,
                createdAt: true,
                updatedAt: true,
                publishedAt: true,
                comments: {
                    orderBy: {
                        createdAt: "asc",
                    },
                    include: {
                        author: {
                            select: {
                                id: true,
                                email: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
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
    public async find(postId: number): Promise<PostDetailed | null> {
        const post = await prisma.post.findFirst({
            where: {
                id: postId,
                OR: [
                    {
                        publishedAt: {
                            lte: new Date(),
                        },
                    },
                    { publishedAt: null },
                ],
                deleted: false,
            },
            select: {
                id: true,
                title: true,
                author: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                _count: {
                    select: {
                        comments: true,
                    },
                },
                image: true,
                content: true,
                createdAt: true,
                updatedAt: true,
                publishedAt: true,
                comments: {
                    orderBy: {
                        createdAt: "asc",
                    },
                    include: {
                        author: {
                            select: {
                                id: true,
                                email: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
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
    public async findAll(): Promise<Array<PostItem>> {
        const posts = await prisma.post.findMany({
            where: {
                OR: [
                    {
                        publishedAt: {
                            lte: new Date(),
                        },
                    },
                    { publishedAt: null },
                ],
                deleted: false,
            },
            orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
            select: {
                id: true,
                title: true,
                author: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                _count: {
                    select: {
                        comments: true,
                    },
                },
                image: true,
                publishedAt: true,
                createdAt: true,
            },
        });

        return posts;
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

        if (user.role !== ROLES.admin && post?.author.id !== user.id) {
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
