export default interface PostItem {
    id: number;
    title: string;
    author: PostAuthor;
    image: string;
    publishedAt: Date | null;
    createdAt: Date;
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
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date | null;
    comments: Array<PostComment>;
    _count: {
        comments: number;
    };
}

export interface PostComment {
    id: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    author: PostAuthor;
}

export interface PostAuthor {
    id: number;
    email: string;
    firstName: string | null;
    lastName: string | null;
}
