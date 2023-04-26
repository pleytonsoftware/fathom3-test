export default interface PostItem {
    id: number;
    title: string;
    author: PostAuthor;
    image: string;
    publishedAt: string | null;
    createdAt: string;
    _count: {
        comments: number;
    };
}

export interface PostDetailed {
    id: number;
    title: string;
    author: PostAuthor;
    image: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
    comments: Array<PostComment>;
    _count: {
        comments: number;
    };
}

export interface PostComment {
    id: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    postId: number;
    authorId: number;
    author: PostAuthor;
}

export interface PostAuthor {
    id: number;
    email: string;
    firstName: string | null;
    lastName: string | null;
}
