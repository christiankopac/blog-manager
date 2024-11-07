import { defineStore } from "pinia";
import {
  fetchPosts, createPost, updatePost, deletePost as apiDeletePost,
} from "../api/posts";
import { fetchUsers } from "../api/users";
import type { Post, User, CreatePostData, UpdatePostData } from "../types";
import { useToastStore } from "./toast";
import type { StoreGeneric } from 'pinia'

// Define store state interface
interface PostsState {
  posts: Post[];          // Array of posts
  users: User[];         // Array of users
  isLoading: boolean;    // Loading state flag
  error: string | null;  // Error message
  pendingOperations: Set<number>; // Set of post IDs with pending operations
  lastAction: string;    // Last performed action description
}

// Define store interface with public methods
export interface PostsStore extends StoreGeneric {
  posts: Post[];
  users: User[];
  error: string | null;
  isLoading: boolean;
  fetchData: () => Promise<void>;
  savePost: (post: CreatePostData & { id?: number }) => Promise<boolean>;
  deletePost: (id: number) => Promise<boolean>;
  deletePosts: (ids: number[]) => Promise<void>;
  getPostsBySearch: (query: string) => Post[];
  getUserName: (userId: number) => string;
  isPostPending: (postId: number) => boolean;
}

// Define and export the store
export const usePostsStore = defineStore("posts", {
  // Initial state
  state: (): PostsState => ({
    posts: [],
    users: [],
    isLoading: false,
    error: null,
    pendingOperations: new Set(),
    lastAction: "",
  }),

  // Getters for computed values
  getters: {
    // Filter posts by search query
    getPostsBySearch: (state) => {
      return (query: string) => {
        const searchQuery = query.toLowerCase();
        return state.posts.filter((post) =>
          post.title.toLowerCase().includes(searchQuery)
        );
      };
    },

    // Get user name by ID
    getUserName: (state) => {
      const userMap = new Map(state.users.map((user) => [user.id, user.name]));
      return (userId: number) => userMap.get(userId) ?? "Unknown";
    },

    // Check if post has pending operations
    isPostPending: (state) => (postId: number) =>
      state.pendingOperations.has(postId),

    // Get last performed action
    getLastAction: (state) => state.lastAction,
  },

  // Actions for async operations
  actions: {
    // Fetch posts and users data
    async fetchData() {
      this.isLoading = true;
      this.error = null;
      const toast = useToastStore();

      try {
        const [postsData, usersData] = await Promise.all([
          fetchPosts(),
          fetchUsers()
        ]);
        this.posts = postsData;
        this.users = usersData;
        this.lastAction = "Data fetched successfully";
      } catch (error) {
        this.error = "Failed to load data. Please try again.";
        toast.error(this.error);
      } finally {
        this.isLoading = false;
      }
    },

    // Save (create/update) a post
    async savePost(postData: CreatePostData & { id?: number }) {
      const { id } = postData;
      const isUpdate = !!id;
      const tempId = isUpdate ? id : -Date.now();
      this.pendingOperations.add(tempId);
      const toast = useToastStore();

      // Handle update
      if (isUpdate) {
        const index = this.posts.findIndex((p) => p.id === id);
        if (index === -1) {
          this.pendingOperations.delete(tempId);
          toast.error("Post not found for update");
          return false;
        }

        const originalPost = { ...this.posts[index] };

        try {
          const updated = await updatePost(id, postData as UpdatePostData);
          this.posts.splice(index, 1, updated as Post);
          toast.success("Post updated successfully");
          return true;
        } catch (error) {
          this.posts.splice(index, 1, originalPost);
          toast.error("Failed to update post");
          return false;
        } finally {
          this.pendingOperations.delete(tempId);
        }
      } 
      // Handle create
      else {
        const tempPost = { id: tempId, ...postData } as Post;
        this.posts.unshift(tempPost);

        try {
          const created = await createPost(postData);
          const index = this.posts.findIndex((p) => p.id === tempId);
          if (index !== -1) {
            this.posts[index] = created as Post;
          }
          toast.success("Post created successfully");
          return true;
        } catch (error) {
          this.posts = this.posts.filter((p) => p.id !== tempId);
          toast.error("Failed to create post");
          return false;
        } finally {
          this.pendingOperations.delete(tempId);
        }
      }
    },

    // Delete multiple posts
    async deletePosts(ids: number[]) {
      const toast = useToastStore();
      const originalPosts = [...this.posts];
      
      this.posts = this.posts.filter(p => !ids.includes(p.id));
      
      try {
        let successCount = 0;
        for (const id of ids) {
          this.pendingOperations.add(id);
          try {
            await apiDeletePost(id);
            successCount++;
          } catch (error) {
            this.error = `Failed to delete post ${id}`;
            toast.error(this.error);
          } finally {
            this.pendingOperations.delete(id);
          }
        }
        
        if (successCount > 0) {
          toast.success(`${successCount} posts deleted`);
        }
        
        return successCount > 0;
      } catch (error) {
        this.posts = originalPosts;
        toast.error("Failed to delete posts");
        return false;
      }
    },

    // Delete single post
    async deletePost(id: number) {
      const postIndex = this.posts.findIndex((p) => p.id === id);
      if (postIndex === -1) return false;

      const deletedPost = this.posts[postIndex];
      this.pendingOperations.add(id);
      this.posts.splice(postIndex, 1);
      const toast = useToastStore();

      try {
        await apiDeletePost(id);
        toast.success("Post deleted successfully");
        return true;
      } catch (error) {
        this.posts.splice(postIndex, 0, deletedPost);
        toast.error("Failed to delete post");
        return false;
      } finally {
        this.pendingOperations.delete(id);
      }
    },
  },
}) as unknown as () => PostsStore

// This store:
// - Uses Pinia for state management
// - Manages posts and users data
// - Handles CRUD operations with optimistic updates
// - Tracks loading and error states
// - Provides search and filtering functionality
// - Manages pending operations for UI feedback
// - Integrates with toast notifications
// - Includes type safety with TypeScript