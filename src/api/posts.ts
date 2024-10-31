import type { Post, CreatePostData, UpdatePostData } from "../types"
import { fetchData, sendRequest } from "./api"

export const fetchPosts = async (): Promise<Post[]> => {
  return fetchData<Post[]>('/posts')
}

export const createPost = async (postData: CreatePostData): Promise<Post> => {
  return sendRequest<Post>('/posts', 'POST', postData)
}

export const updatePost = async (id: number, postData: UpdatePostData): Promise<Post> => {
  return sendRequest<Post>(`/posts/${id}`, 'PUT', postData)
}

export const deletePost = async (id: number): Promise<void> => {
  return sendRequest<void>(`/posts/${id}`, 'DELETE')
}