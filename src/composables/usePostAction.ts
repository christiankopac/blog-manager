import type { PostsStore } from "@/stores/posts"

interface CreatePostData {
  title: string
  body: string
  userId: number
}

export function usePostAction(store: PostsStore) {
  const savePost = async (postData: CreatePostData & { id?: number }) => {
    return store.savePost(postData)
  }

  return {
    savePost
  }
}