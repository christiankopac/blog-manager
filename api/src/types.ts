export interface User {
    id: number;
    name: string;
    email: string;
    username: string;
}

export interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
}

export interface CreatePostData {
    title: string;
    body: string;
    userId: number;
}

export interface UpdatePostData extends CreatePostData {
    id: number;
}